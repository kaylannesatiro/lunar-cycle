require('dotenv/config');

const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routers/authRoutes');
const ciclosRoutes = require('./routers/ciclosRoutes');
const sonhoRoutes = require('./routers/sonhoRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
// Rota para autenticação
app.use('/api/auth', authRoutes);
app.use('/api/ciclos', ciclosRoutes);
app.use('/api/sonhos', sonhoRoutes);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Lunar Cycle Backend Rodando! 🌙');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});