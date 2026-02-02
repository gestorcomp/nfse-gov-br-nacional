import { DPS } from '../models/dps';
import { format } from 'date-fns';

/**
 * Converts a DPS object to its XML string representation.
 * Note: This is a simplified builder for the MVP. A more robust XML library
 * might be used in the future for better maintainability.
 *
 * @param dps The DPS object.
 * @returns The XML string representation of the DPS.
 */
export function buildDpsXml(dps: DPS): string {
  // Helper to format dates to 'yyyy-MM-dd'
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

  // Helper to safely add optional elements
  const addOptional = (tag: string, value: any) => (value ? `<${tag}>${value}</${tag}>` : '');
  const addOptionalFloat = (tag: string, value: any) => (value ? `<${tag}>${value.toFixed(2)}</${tag}>` : '');

  return `<?xml version="1.0" encoding="UTF-8"?>
<DPS xmlns="http://www.nfse.gov.br/nfse">
  <identificacao>
    <numero>${dps.identificacao.numero}</numero>
    <serie>${dps.identificacao.serie}</serie>
    <dataEmissao>${formatDate(dps.identificacao.dataEmissao)}</dataEmissao>
    <competencia>${formatDate(dps.identificacao.competencia)}</competencia>
    <tipoTributacao>${dps.identificacao.tipoTributacao}</tipoTributacao>
  </identificacao>
  <prestador>
    <cnpj>${dps.prestador.cnpj}</cnpj>
    ${addOptional('inscricaoMunicipal', dps.prestador.inscricaoMunicipal)}
    ${addOptional('regimeEspecialTributacao', dps.prestador.regimeEspecialTributacao)}
  </prestador>
  <tomador>
    <identificacao>
      <cnpjCpf>${dps.tomador.identificacao.cnpjCpf}</cnpjCpf>
      ${addOptional('inscricaoMunicipal', dps.tomador.identificacao.inscricaoMunicipal)}
    </identificacao>
    <razaoSocial>${dps.tomador.razaoSocial}</razaoSocial>
    <endereco>
        <logradouro>${dps.tomador.endereco.logradouro}</logradouro>
        <numero>${dps.tomador.endereco.numero}</numero>
        ${addOptional('complemento', dps.tomador.endereco.complemento)}
        <bairro>${dps.tomador.endereco.bairro}</bairro>
        <codigoMunicipio>${dps.tomador.endereco.codigoMunicipio}</codigoMunicipio>
        <uf>${dps.tomador.endereco.uf}</uf>
        <cep>${dps.tomador.endereco.cep}</cep>
    </endereco>
  </tomador>
  <servico>
    <codigoNbs>${dps.servico.codigoNbs}</codigoNbs>
    <discriminacao>${dps.servico.discriminacao}</discriminacao>
    <valorServicos>${dps.servico.valorServicos.toFixed(2)}</valorServicos>
    ${addOptionalFloat('valorDeducoes', dps.servico.valorDeducoes)}
    ${addOptionalFloat('valorPis', dps.servico.valorPis)}
    ${addOptionalFloat('valorCofins', dps.servico.valorCofins)}
    ${addOptionalFloat('valorInss', dps.servico.valorInss)}
    ${addOptionalFloat('valorIr', dps.servico.valorIr)}
    ${addOptionalFloat('valorCsll', dps.servico.valorCsll)}
    <issRetido>${dps.servico.issRetido}</issRetido>
    ${addOptionalFloat('valorIss', dps.servico.valorIss)}
    ${addOptionalFloat('aliquota', dps.servico.aliquota)}
    <itemListaServico>${dps.servico.itemListaServico}</itemListaServico>
    <municipioPrestacao>${dps.servico.municipioPrestacao}</municipioPrestacao>
  </servico>
</DPS>`;
}
