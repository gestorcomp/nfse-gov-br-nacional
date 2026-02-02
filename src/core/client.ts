import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import * as forge from 'node-forge';
import { CertificateData } from './certificate';
import { NfseEnvironment, environmentUrls } from '../config/environments';

/**
 * Configuration for the NfseClient.
 */
export interface NfseClientConfig {
  environment: NfseEnvironment;
  certificate: CertificateData;
  timeout?: number;
}

/**
 * A secure HTTP client for communicating with the NFSe Nacional API.
 * It handles mTLS authentication using a provided A1 certificate.
 */
export class NfseClient {
  private readonly client: AxiosInstance;
  private readonly config: NfseClientConfig;

  constructor(config: NfseClientConfig) {
    this.config = config;

    const { privateKey, certificate, caCertificates } = this.config.certificate;
    const { environment, timeout = 30000 } = this.config;

    // node-forge requires a password to create a PFX. Since this is for an in-memory
    // representation passed directly to the https.Agent, we can use a temporary, random one.
    const tempPassword = Math.random().toString(36).substring(2);

    const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
      privateKey as any,
      [certificate, ...caCertificates],
      tempPassword,
      { algorithm: '3des' }
    );

    const p12Der = forge.asn1.toDer(p12Asn1).getBytes();
    const p12Buffer = Buffer.from(p12Der, 'binary');

    const httpsAgent = new https.Agent({
      pfx: p12Buffer,
      passphrase: tempPassword,
      rejectUnauthorized: true, // Ensure the server certificate is validated
    });

    this.client = axios.create({
      baseURL: environmentUrls[environment],
      httpsAgent,
      timeout,
      headers: {
        'Content-Type': 'application/xml;charset=utf-8',
      },
    });
  }

  /**
   * Sends a POST request to the specified path with the given XML payload.
   *
   * @param path The API endpoint path.
   * @param xmlPayload The XML string to send.
   * @returns A promise that resolves with the response data.
   */
  async post(path: string, xmlPayload: string): Promise<any> {
    try {
      const response = await this.client.post(path, xmlPayload);
      return response.data;
    } catch (error) {
      // Enhance error handling to provide more context
      if (axios.isAxiosError(error)) {
        const { response } = error;
        const errorMessage = response?.data || error.message;
        throw new Error(`API request failed with status ${response?.status}: ${errorMessage}`);
      }
      throw new Error(`An unexpected error occurred: ${error}`);
    }
  }
}
