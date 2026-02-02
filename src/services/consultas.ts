import { NfseClient } from '../core/client';
import { NFSe, DPSConsultaResponse } from '../models/responses';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

/**
 * Consults an NFSe by its access key.
 *
 * @param chaveAcesso The 50-character access key of the NFSe.
 * @param client An instance of the configured NfseClient.
 * @returns A promise that resolves with the NFSe data.
 */
export async function consultarNfseChave(chaveAcesso: string, client: NfseClient): Promise<NFSe> {
  const xmlPayload = `<ConsultarNfse>
                        <chaveAcesso>${chaveAcesso}</chaveAcesso>
                      </ConsultarNfse>`;

  // Placeholder for the actual API endpoint
  const responseXml = await client.post('/ws/consultarNfse', xmlPayload);

  const parser = new XMLParser();
  const parsedResponse = parser.parse(responseXml);

  // The exact path to the data needs to be verified against the API's response
  const nfseData = parsedResponse?.retornoConsultaNfse?.nfse;
  if (!nfseData) {
    throw new Error('Could not find NFSe data in the API response.');
  }

  return nfseData as NFSe;
}

/**
 * Consults a DPS by its access key.
 *
 * @param chaveAcesso The access key of the DPS.
 * @param client An instance of the configured NfseClient.
 * @returns A promise that resolves with the DPS consultation data.
 */
export async function consultarDpsChave(chaveAcesso: string, client: NfseClient): Promise<DPSConsultaResponse> {
  const xmlPayload = `<ConsultarDps>
                        <chaveAcesso>${chaveAcesso}</chaveAcesso>
                      </ConsultarDps>`;

  // Placeholder for the actual API endpoint
  const responseXml = await client.post('/ws/consultarDps', xmlPayload);

  const parser = new XMLParser();
  const parsedResponse = parser.parse(responseXml);

  // The exact path to the data needs to be verified against the API's response
  const dpsData = parsedResponse?.retornoConsultaDps;
  if (!dpsData) {
    throw new Error('Could not find DPS data in the API response.');
  }

  return dpsData as DPSConsultaResponse;
}
