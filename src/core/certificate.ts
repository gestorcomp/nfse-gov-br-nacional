import * as forge from 'node-forge';
import * as fs from 'fs';

/**
 * Interface for the extracted certificate data.
 */
export interface CertificateData {
  privateKey: forge.pki.PrivateKey;
  certificate: forge.pki.Certificate;
  caCertificates: forge.pki.Certificate[];
}

/**
 * Loads an A1 certificate from a PFX/P12 file.
 *
 * @param pfxBuffer The buffer containing the PFX/P12 file content.
 * @param password The password for the certificate.
 * @returns An object containing the private key, certificate, and CA certificates.
 * @throws Will throw an error if the certificate cannot be loaded or parsed.
 */
export function loadA1Certificate(pfxBuffer: Buffer, password: string): CertificateData {
  try {
    const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

    let privateKey: forge.pki.PrivateKey | null = null;
    let certificate: forge.pki.Certificate | null = null;
    const caCertificates: forge.pki.Certificate[] = [];

    // Find the private key and certificate
    for (const safeContent of p12.safeContents) {
      for (const key in safeContent.safeBags) {
        const bags = safeContent.safeBags[key];
        if (Array.isArray(bags)) {
          for (const bag of bags) {
            if (bag.type === forge.pki.oids.pkcs8ShroudedKeyBag) {
              privateKey = bag.key as forge.pki.PrivateKey;
            } else if (bag.type === forge.pki.oids.certBag) {
              if (certificate === null) {
                certificate = bag.cert as forge.pki.Certificate;
              } else {
                caCertificates.push(bag.cert as forge.pki.Certificate);
              }
            }
          }
        }
      }
    }

    if (!privateKey || !certificate) {
      throw new Error('Could not find private key or certificate in PFX/P12 file.');
    }

    return { privateKey, certificate, caCertificates };
  } catch (error) {
    if (error instanceof Error) {
        if (error.message.includes('Invalid password')) {
            throw new Error('The provided password for the certificate is incorrect.');
        }
        if(error.message.includes('Unable to parse PKCS#12')) {
            throw new Error('Unable to parse the certificate. The file may be corrupt or in an unsupported format.');
        }
    }
    throw new Error(`Failed to load A1 certificate: ${error}`);
  }
}
