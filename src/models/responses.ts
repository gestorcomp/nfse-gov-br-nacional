/**
 * Represents the structure of a successfully queried NFSe.
 * The fields here are based on common NFSe layouts and should be
 * adjusted according to the actual API response.
 */
export interface NFSe {
  chaveAcesso: string;
  numero: string;
  dataEmissao: Date;
  status: string;
  valorTotal: number;
  prestador: {
    cnpj: string;
    razaoSocial: string;
  };
  tomador: {
    cnpjCpf: string;
    razaoSocial: string;
  };
  // ... other fields of a complete NFSe
}

/**
 * Represents the structure of a successfully queried DPS.
 */
export interface DPSConsultaResponse {
  chaveAcesso: string;
  status: 'enviada' | 'processada' | 'erro';
  numeroNfse?: string; // Available if the DPS was successfully converted to NFSe
  // ... other fields related to DPS status
}
