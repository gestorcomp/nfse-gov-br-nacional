import { loadA1Certificate } from '../../src/core/certificate';
import * as forge from 'node-forge';

// Mock only the pkcs12FromAsn1 function
jest.mock('node-forge', () => {
  const originalForge = jest.requireActual('node-forge');
  return {
    ...originalForge,
    pkcs12: {
      ...originalForge.pkcs12,
      pkcs12FromAsn1: jest.fn(),
    },
    asn1: {
      fromDer: (data: any) => data, // Keep it simple
    },
  };
});

describe('Certificate Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load a certificate successfully', () => {
    const mockP12 = {
      safeContents: [
        {
          safeBags: {
            [forge.pki.oids.certBag]: [{ type: forge.pki.oids.certBag, cert: 'mockCert' }],
            [forge.pki.oids.pkcs8ShroudedKeyBag]: [{ type: forge.pki.oids.pkcs8ShroudedKeyBag, key: 'mockKey' }],
          }
        }
      ],
    };
    (forge.pkcs12.pkcs12FromAsn1 as jest.Mock).mockReturnValue(mockP12);

    const data = loadA1Certificate(Buffer.from(''), 'pwd');
    expect(data.certificate).toBe('mockCert');
    expect(data.privateKey).toBe('mockKey');
  });

  it('should throw if password is wrong', () => {
    (forge.pkcs12.pkcs12FromAsn1 as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid password');
    });
    expect(() => loadA1Certificate(Buffer.from(''), 'pwd'))
        .toThrow('The provided password for the certificate is incorrect.');
  });
});
