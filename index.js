const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'AFIP Backend funcionando ✅' });
});

app.post('/facturar', async (req, res) => {
  // Aquí irá la lógica de AFIP
  res.json({ message: 'Endpoint listo' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
