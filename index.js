const express = require('express');
const Afip = require('@afipsdk/afip.js');
const app = express();
app.use(express.json());

const afip = new Afip({
  CUIT: 20409378472,
  access_token: process.env.AFIP_TOKEN,
  production: false
});

app.get('/', function(req, res) {
  res.json({ status: 'AFIP Backend funcionando OK' });
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
