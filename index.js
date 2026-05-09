const express = require('express');
const Afip = require('@afipsdk/afip.js');
const forge = require('node-forge');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AFIP Backend funcionando ✅' });
});

app.get('/generar-certificado/:cuit', (req, res) => {
  const cuit = req.params.cuit;
  const keys = forge.pki.rsa.generateKeyPair(2048);
  const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
  const cs
