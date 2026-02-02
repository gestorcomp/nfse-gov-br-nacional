/**
 * This is an example script demonstrating how to use the nfse-nacional library
 * to send a DPS (Declaração Prévia de Serviço).
 *
 * To run this example, you will need a valid A1 certificate (.pfx file) and its password.
 *
 * How to run:
 * 1. Make sure you have ts-node installed: `npm install -g ts-node`
 * 2. Place your certificate file (e.g., 'certificate.pfx') in the root of the project.
 * 3. Update the `certPassword` and `pfxPath` variables below.
 * 4. Fill in the DPS data with valid information for the homologation environment.
 * 5. Run the script from the root directory: `ts-node examples/send-dps-example.ts`
 */
import * as fs from 'fs';
import * as path from 'path';
import { loadA1Certificate } from '../src/core/certificate';
import { NfseClient } from '../src/core/client';
import { enviaDps } from '../src/services/dps';
import { DPS } from '../src/models/dps';

// --- Configuration ---
const certPassword = 'YOUR_CERTIFICATE_PASSWORD'; // <-- IMPORTANT: Change this
const pfxPath = path.resolve(__dirname, '../../certificate.pfx'); // <-- IMPORTANT: Update if your cert has a different name

// Main function to run the example
async function main() {
  console.log('--- NFSe Nacional Library: Send DPS Example ---');

  if (certPassword === 'YOUR_CERTIFICATE_PASSWORD') {
    console.error('Please update the `certPassword` in the example script before running.');
    return;
  }
  if (!fs.existsSync(pfxPath)) {
    console.error(`Certificate file not found at: ${pfxPath}`);
    console.error('Please place your .pfx file in the root of the project or update the `pfxPath`.');
    return;
  }

  try {
    // 1. Load the Certificate
    console.log('Loading A1 certificate...');
    const pfxBuffer = fs.readFileSync(pfxPath);
    const certificateData = loadA1Certificate(pfxBuffer, certPassword);
    console.log('Certificate loaded successfully.');

    // 2. Create the mTLS HTTP Client for Homologation environment
    console.log('Initializing HTTP client for homologation...');
    const client = new NfseClient({
      environment: 'homologacao',
      certificate: certificateData,
    });
    console.log('Client initialized.');

    // 3. Create the DPS object with your data
    //    (Replace with actual data for a valid test)
    const dps: DPS = {
      identificacao: {
        numero: '1',
        serie: '1',
        dataEmissao: new Date(),
        competencia: new Date(),
        tipoTributacao: 'T', // Tributável
      },
      prestador: {
        cnpj: 'YOUR_CNPJ', // <-- Change to the CNPJ from your certificate
      },
      tomador: {
        identificacao: {
          cnpjCpf: 'CUSTOMER_CNPJ_OR_CPF', // <-- Change to a valid CNPJ/CPF
        },
        razaoSocial: 'CLIENTE DE TESTE',
        endereco: {
          logradouro: 'Rua do Cliente',
          numero: '123',
          bairro: 'Centro',
          codigoMunicipio: '3550308', // São Paulo
          uf: 'SP',
          cep: '01001000',
        },
      },
      servico: {
        codigoNbs: '1.0401', // Análise e desenvolvimento de sistemas
        discriminacao: 'Desenvolvimento de software',
        valorServicos: 100.00,
        issRetido: false,
        itemListaServico: '01.01',
        municipioPrestacao: '3550308', // São Paulo
      },
    };
    console.log('DPS object created.');

    // 4. Send the DPS
    console.log('Sending DPS to the API...');
    const response = await enviaDps(dps, client, certificateData);

    // 5. Log the response
    console.log('--- DPS Sent Successfully! ---');
    console.log('API Response:', response);
    console.log('Access Key:', response.chaveAcesso);

  } catch (error) {
    console.error('--- An Error Occurred ---');
    console.error(error);
  }
}

// Execute the script
main();
