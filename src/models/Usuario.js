const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir password en las consultas por defecto
  },
  edad: {
    type: Number,
    min: [0, 'La edad no puede ser negativa']
  },
  telefono: {
    type: String,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permite múltiples documentos sin este campo
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre('save', async function() {
  // Solo hashear si la contraseña ha sido modificada o es nueva
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);