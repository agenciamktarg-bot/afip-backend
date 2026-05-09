const express = require('express');
const Afip = require('@afipsdk/afip.js');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AFIP Backend funcionando ✅' });
});

app.post('/facturar', async (req, res) => {
  res.json({ message: 'Endpoint listo' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
