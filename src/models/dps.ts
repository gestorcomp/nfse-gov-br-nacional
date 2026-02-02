/**
 * Based on ANEXO_I-SEFIN_ADN-DPS_NFSe-SNNFSe
 */

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  codigoMunicipio: string;
  uf: string;
  cep: string;
}

export interface Contato {
  telefone?: string;
  email?: string;
}

export interface DPS {
  identificacao: {
    numero: string;
    serie: string;
    dataEmissao: Date;
    competencia: Date;
    tipoTributacao: 'T' | 'F' | 'A' | 'B' | 'M' | 'N' | 'X' | 'V' | 'P' | 'S';
  };
  prestador: {
    cnpj: string;
    inscricaoMunicipal?: string;
    regimeEspecialTributacao?: string;
  };
  tomador: {
    identificacao: {
      cnpjCpf: string;
      inscricaoMunicipal?: string;
    };
    razaoSocial: string;
    endereco: Endereco;
    contato?: Contato;
  };
  servico: {
    codigoNbs: string;
    discriminacao: string;
    valorServicos: number;
    valorDeducoes?: number;
    valorPis?: number;
    valorCofins?: number;
    valorInss?: number;
    valorIr?: number;
    valorCsll?: number;
    issRetido: boolean;
    valorIss?: number;
    aliquota?: number;
    descontoIncondicionado?: number;
    descontoCondicionado?: number;
    itemListaServico: string;
    codigoCnae?: string;
    codigoTributacaoMunicipio?: string;
    municipioPrestacao: string;
    paisPrestacao?: string;
  };
  construcaoCivil?: {
    codigoObra?: string;
    art?: string;
    inscricaoImobiliaria?: string;
    endereco?: Endereco;
  };
  atividadesEvento?: {
    codigoEvento: string;
    nomeEvento: string;
    dataInicio: Date;
    dataFim: Date;
    endereco: Endereco;
  };
  ibsCbs?: {
    situacaoTributaria: string;
    classificacaoTributaria: string;
    valorAliquota?: number;
    valorIBS?: number;
    valorCBS?: number;
  };
}

export interface NFSeResponse {
    chaveAcesso: string;
    // ... other fields from the API response
}
