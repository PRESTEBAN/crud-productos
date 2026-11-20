const fs = require('fs');
const path = require('path');

const required = ['FIREBASE_API_KEY','FIREBASE_AUTH_DOMAIN','FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET','FIREBASE_MESSAGING_SENDER_ID','FIREBASE_APP_ID'];
const missing = required.filter((k) => !process.env[k]);
const target = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');

if (missing.length && fs.existsSync(target)) {
  console.log('Usando environment.ts local existente.');
  process.exit(0);
}
if (missing.length) {
  console.error('Faltan variables de entorno: ' + missing.join(', '));
  process.exit(1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });

const content = `export const environment = {
  firebase: {
    apiKey: '${process.env.FIREBASE_API_KEY}',
    authDomain: '${process.env.FIREBASE_AUTH_DOMAIN}',
    projectId: '${process.env.FIREBASE_PROJECT_ID}',
    storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET}',
    messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID}',
    appId: '${process.env.FIREBASE_APP_ID}',
  },
};
`;
fs.writeFileSync(target, content);
console.log('environment.ts generado.');