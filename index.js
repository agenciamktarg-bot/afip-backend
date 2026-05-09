const express = require('express');
const Afip = require('@afipsdk/afip.js');
const fs = require('fs');
const app = express();
app.use(express.json());

// Escribir cert y key desde variables de entorno
fs.writeFileSync('/tmp/cert.crt', process.env.AFIP_CERT.replace(/\\n/g, '\n'));
fs.writeFileSync('/tmp/private.key', process.env.AFIP_KEY.replace(/\\n/g, '\n'));

const afip = new Afip({
  CUIT: process.env.AFIP_CUIT,
  cert: '/tmp/cert.crt',
  key: '/tmp/private.key',
  production: false // homologación por ahora
});

app.get('/', (req, res) => {
  res.json({ status: 'AFIP Backend funcionando ✅' });
});

app.post('/facturar', async (req, res) => {
  try {
    const { importe, concepto } = req.body;
    const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const ultimoNro = await afip.ElectronicBilling.getLastVoucher(2, 11);
    const data
