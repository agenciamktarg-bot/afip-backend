const express = require('express');
const Afip = require('@afipsdk/afip.js');
const forge = require('node-forge');
const app = express();
app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const afip = new Afip({
  CUIT: 20409378472,
  access_token: process.env.AFIP_TOKEN,
  production: false
});

app.get('/', function(req, res) {
  res.json({ status: 'AFIP Backend funcionando OK' });
});

app.get('/generar-certificado/:cuit', function(req, res) {
  try {
    var cuit = req.params.cuit;
    var keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 });
    var privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    var csr = forge.pki.createCertificationRequest();
    csr.publicKey = keypair.publicKey;
    csr.setSubject([
      { name: 'countryName', value: 'AR' },
      { name: 'organizationName', value: 'MOBA' },
      { name: 'commonName', value: cuit },
      { name: 'serialName', value: 'CUIT ' + cuit, type: '2.5.4.5' }
    ]);
    csr.sign(keypair.privateKey);
    res.json({ privateKey: privateKey, csr: forge.pki.certificationRequestToPem(csr) });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/facturar', async function(req, res) {
  try {
    var importe = req.body.importe;
    var condicionIVA = req.body.condicionIVA || 5;
    var fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
    var ultimoNro = await afip.ElectronicBilling.getLastVoucher(1, 6);
    var data = {
      CantReg: 1,
      PtoVta: 1,
      CbteTipo: 6,
      Concepto: 1,
      DocTipo: 99,
      DocNro: 0,
      CbteDesde: ultimoNro + 1,
      CbteHasta: ultimoNro + 1,
      CbteFch: parseInt(fecha),
      ImpTotal: importe,
      ImpTotConc: 0,
      ImpNeto: importe,
      ImpOpEx: 0,
      ImpIVA: 0,
      ImpTrib: 0,
      MonId: 'PES',
      MonCotiz: 1,
      CondicionIVAReceptorId: condicionIVA,
      Iva: [{ Id: 3, BaseImp: importe, Importe: 0 }]
    };
    var result = await afip.ElectronicBilling.createNextVoucher(data);
    res.json({ success: true, CAE: result.CAE, numero: result.voucher_number });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Servidor corriendo en puerto ' + PORT);
});
