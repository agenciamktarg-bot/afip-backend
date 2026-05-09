const express = require('express');
const { execSync } = require('child_process');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AFIP Backend funcionando ✅' });
});

app.get('/generar-certificado/:cuit', (req, res) => {
  try {
    const cuit = req.params.cuit;
    const key = execSync(`openssl genrsa 2048`).toString();
    const csr = execSync(
      `echo "${key}" | openssl req -new -key /dev/stdin -subj "/C=AR/O=MOBA/CN=${cuit}/serialNumber=CUIT ${cuit}"`
    ).toString();
    res.json({ privateKey: key, csr });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/facturar', async (req, res) => {
  res.json({ message: 'Endpoint listo' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
