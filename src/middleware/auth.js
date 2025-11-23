const { verificarToken } = require('../utils/jwt');
const Usuario = require('../models/Usuario');

const protegerRuta = async (req, res, next) => {
  try {
    // 1. Obtener el token del header
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // 2. Verificar si existe el token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado. Token no proporcionado'
      });
    }
    
    // 3. Verificar el token
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // 4. Obtener el usuario del token
    const usuario = await Usuario.findById(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // 5. Agregar usuario a la request
    req.usuario = usuario;
    next();
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en la autenticación',
      error: error.message
    });
  }
};

module.exports = { protegerRuta };