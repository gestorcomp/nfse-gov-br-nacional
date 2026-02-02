export { NfseClient } from './core/client';
export type { NfseClientConfig } from './core/client';

export { loadA1Certificate } from './core/certificate';
export type { CertificateData } from './core/certificate';

export { enviaDps } from './services/dps';
export { consultarNfseChave, consultarDpsChave } from './services/consultas';

export { environmentUrls } from './config/environments';
export type { NfseEnvironment } from './config/environments';

export type { DPS, Endereco, Contato, NFSeResponse } from './models/dps';
export type { NFSe, DPSConsultaResponse } from './models/responses';
