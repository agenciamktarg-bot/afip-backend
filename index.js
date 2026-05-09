const express = require('express');
const Afip = require('@afipsdk/afip.js');
const fs = require('fs');
const app = express();
app.use(express.json());

const cert = process.env.AFIP_CERT;
const key = process.env.AFIP_KEY;

fs.writeFileSync('/tmp/cert.crt', cert);
fs.writeFileSync('/tmp/private.key', key);

const afip = new Afip({
  CUIT: parseInt(process.env.AFIP_CUIT),
  cert: '/tmp/cert.crt',
  key: '/tmp/private.key',
  production: false
});

app.get('/', function(req, res) {
  res.json({ status: 'AFIP Backend funcionando OK' });
});

app.post('/facturar', async function(req, res) {
  try {
    var importe = req.body.importe;
    var fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
    var ultimoNro = await afip.ElectronicBilling.getLastVoucher(2, 11);
    var data = {
      CantReg: 1,
      PtoVta: 2,
      CbteTipo: 11,
      Concepto: 2,
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
      MonCotiz: 1
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
