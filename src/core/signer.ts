import * as forge from 'node-forge';
import { CertificateData } from './certificate';

/**
 * Signs an XML string with the provided certificate data.
 *
 * @param xml The XML string to sign.
 * @param certificateData The certificate data to use for signing.
 * @param tagToSign The name of the tag within the XML to which the signature will be appended.
 * @returns The signed XML string.
 */
export function signXml(xml: string, certificateData: CertificateData, tagToSign: string): string {
    const { privateKey, certificate } = certificateData;

    // 1. Create the digest of the XML
    const md = forge.md.sha256.create();
    md.update(xml, 'utf8');
    const digest = md.digest().bytes();
    const digestB64 = forge.util.encode64(digest);

    // 2. Define the <SignedInfo> block. This is what actually gets signed.
    const signedInfo = `<SignedInfo>
                <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />
                <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256" />
                <Reference URI="">
                    <Transforms>
                        <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" />
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256" />
                    <DigestValue>${digestB64}</DigestValue>
                </Reference>
            </SignedInfo>`;

    // 3. Create the signature of the <SignedInfo> block
    const signatureMd = forge.md.sha256.create();
    signatureMd.update(signedInfo, 'utf8');
    const signature = (privateKey as any).sign(signatureMd);
    const signatureB64 = forge.util.encode64(signature);

    // 4. Extract the certificate in Base64 format
    const certPem = forge.pki.certificateToPem(certificate);
    const certB64 = forge.util.encode64(certPem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\r|\n/g, ''));


    // 5. Assemble the final <Signature> block
    const signatureBlock = `<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
            ${signedInfo}
            <SignatureValue>${signatureB64}</SignatureValue>
            <KeyInfo>
                <X509Data>
                    <X509Certificate>${certB64}</X509Certificate>
                </X509Data>
            </KeyInfo>
        </Signature>`;

    // 6. Inject the signature block into the original XML
    const signedXml = xml.replace(`</${tagToSign}>`, `${signatureBlock}</${tagToSign}>`);

    return signedXml;
}
