const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routers/authRoutes');
const ciclosRoutes = require('./routers/ciclosRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/ciclos', ciclosRoutes);

// Rotas
// Rota para autenticação
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Lunar Cycle Backend Rodando! 🌙');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});