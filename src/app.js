const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Práctica 5 - Desarrollo Web',
    version: '1.0.0',
    endpoints: {
      auth: {
        registro: 'POST /api/auth/registro',
        login: 'POST /api/auth/login',
        googleAuth: 'GET /api/auth/google',
        perfil: 'GET /api/auth/perfil (requiere token)'
      },
      usuarios: '/api/usuarios (requiere token)'
    }
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

module.exports = app;