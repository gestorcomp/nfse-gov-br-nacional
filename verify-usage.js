const lib = require('./dist/index');

console.log('Library loaded successfully.');
console.log('Exports:', Object.keys(lib));

const expectedExports = [
  'NfseClient',
  'loadA1Certificate',
  'enviaDps',
  'consultarNfseChave',
  'consultarDpsChave',
  'environmentUrls'
];

const missing = expectedExports.filter(e => !lib[e]);

if (missing.length > 0) {
  console.error('Missing exports:', missing);
  process.exit(1);
}

console.log('All expected exports are present.');
process.exit(0);
