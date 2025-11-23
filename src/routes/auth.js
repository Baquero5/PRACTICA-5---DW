const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const Usuario = require('../models/Usuario');
const { generarToken } = require('../utils/jwt');
const { protegerRuta } = require('../middleware/auth');

// REGISTRO - Crear nuevo usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, email, password, edad, telefono } = req.body;
    
    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    
    if (usuarioExiste) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }
    
    // Crear nuevo usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      edad,
      telefono,
      provider: 'local'
    });
    
    // Generar token
    const token = generarToken({ id: usuario._id });
    
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        edad: usuario.edad,
        telefono: usuario.telefono,
        provider: usuario.provider
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// LOGIN - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar que se envíen email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione email y contraseña'
      });
    }
    
    // Buscar usuario y incluir password
    const usuario = await Usuario.findOne({ email }).select('+password');
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar que el usuario no sea de Google
    if (usuario.provider === 'google') {
      return res.status(401).json({
        success: false,
        message: 'Esta cuenta fue creada con Google. Por favor inicia sesión con Google.'
      });
    }
    
    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);
    
    if (!passwordCorrecto) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token
    const token = generarToken({ id: usuario._id });
    
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        edad: usuario.edad,
        telefono: usuario.telefono,
        provider: usuario.provider
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// GOOGLE OAuth - Iniciar autenticación
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// GOOGLE OAuth - Callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  (req, res) => {
    // Generar token JWT
    const token = generarToken({ id: req.user._id });
    
    // En desarrollo: redirigir al frontend con el token en la URL
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Redirigir al frontend con el token
    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
  }
);

// PERFIL - Obtener información del usuario autenticado (RUTA PROTEGIDA)
router.get('/perfil', protegerRuta, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.usuario._id,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
        edad: req.usuario.edad,
        telefono: req.usuario.telefono,
        avatar: req.usuario.avatar,
        provider: req.usuario.provider,
        createdAt: req.usuario.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
});

module.exports = router;