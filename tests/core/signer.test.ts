import { signXml } from '../../src/core/signer';
import { CertificateData } from '../../src/core/certificate';
import * as forge from 'node-forge';

jest.mock('node-forge', () => {
  const original = jest.requireActual('node-forge');
  return {
    ...original,
    pki: {
      ...original.pki,
      certificateToPem: () => '-----BEGIN CERTIFICATE-----\nMOCK_PEM\n-----END CERTIFICATE-----'
    }
  };
});

// A simplified mock for certificate data to avoid complex Pem parsing in tests
const mockCertificateData: CertificateData = {
  privateKey: {
    sign: () => 'mockSignature', // Mock the sign method
  } as any,
  certificate: {
    // Mock whatever properties of the certificate are needed
  } as any,
  caCertificates: [],
};


describe('XML Signer', () => {
  it('should add a Signature block to the XML document', () => {
    const xml = '<DPS><info>TestData</info></DPS>';

    const signedXml = signXml(xml, mockCertificateData, 'DPS');

    expect(signedXml).toContain('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">');
    expect(signedXml).toContain('<SignatureValue>bW9ja1NpZ25hdHVyZQ==</SignatureValue>'); // base64 of 'mockSignature'
    expect(signedXml).toContain('</DPS>');
  });
});
