/**
 * Defines the available environments for the NFSe API.
 */
export type NfseEnvironment = 'producao' | 'homologacao';

/**
 * A mapping of environments to their respective API base URLs.
 */
export const environmentUrls: Record<NfseEnvironment, string> = {
  producao: 'https://www.nfse.gov.br',
  homologacao: 'https://www.producaorestrita.nfse.gov.br',
};
