import { DPS, NFSeResponse } from '../models/dps';
import { NfseClient } from '../core/client';
import { CertificateData } from '../core/certificate';
import { buildDpsXml } from '../utils/xml';
import { signXml } from '../core/signer';
import { compressAndEncodeXml } from '../utils/compression';
import { XMLParser } from 'fast-xml-parser';

/**
 * Orchestrates the process of sending a DPS to the NFSe Nacional API.
 *
 * @param dps The DPS object to be sent.
 * @param client An instance of the configured NfseClient.
 * @param certificate The certificate data for signing.
 * @returns A promise that resolves with the response from the API.
 * @throws Will throw an error if any step of the process fails.
 */
export async function enviaDps(
  dps: DPS,
  client: NfseClient,
  certificate: CertificateData
): Promise<NFSeResponse> {
  try {
    // 1. Build the DPS XML from the object
    const dpsXml = buildDpsXml(dps);

    // 2. Sign the DPS XML document
    // The signature must be applied to the <DPS> tag
    const signedDpsXml = signXml(dpsXml, certificate, 'DPS');

    // 3. Compress and Base64 encode the signed XML
    const compressedPayload = await compressAndEncodeXml(signedDpsXml);

    // 4. Wrap the payload in the required structure for the API
    const finalXml = `<EnviarDeclaracaoServico><dps_compactado>${compressedPayload}</dps_compactado></EnviarDeclaracaoServico>`;

    // 5. Send the request using the mTLS client
    // The specific endpoint path needs to be confirmed from the official documentation,
    // '/ws/enviarDps' is a placeholder based on common patterns.
    const responseXml = await client.post('/ws/enviarDps', finalXml);

    // 6. Parse the XML response
    const parser = new XMLParser();
    const parsedResponse = parser.parse(responseXml);

    // The exact path to the response data needs to be verified against the API's actual response structure.
    const chaveAcesso = parsedResponse?.retornoEnvioDps?.chaveAcesso;
    if (!chaveAcesso) {
        throw new Error('Could not find chaveAcesso in the API response.');
    }

    return {
      chaveAcesso,
      ...parsedResponse.retornoEnvioDps,
    };

  } catch (error) {
    console.error('Failed to send DPS:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}
