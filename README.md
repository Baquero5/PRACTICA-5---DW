# Práctica 5 - Sistema de Gestión de Usuarios

Sistema web completo con autenticación JWT y OAuth (Google), desarrollado con Node.js, Express, MongoDB y React.

## Características

**Backend (API REST)**
- CRUD completo de usuarios
- Autenticación con JWT
- Login con Google OAuth 2.0
- Encriptación de contraseñas con bcrypt
- Rutas protegidas con middleware
- Base de datos MongoDB NoSQL

**Frontend (React)**
- Interfaz responsive
- Registro e inicio de sesión
- Dashboard personalizado
- Gestión completa de usuarios
- Rutas protegidas
- Context API para estado global
  

## Requisitos Previos

- Node.js 18 o superior
- npm 9 o superior
- Git
- Cuenta en MongoDB Atlas
- Cuenta en Google Cloud Console (para OAuth)

Verificar instalación:
```bash
node -v
npm -v
git --version
```

---

## Instalación

### 2. Instalar Dependencias

```bash
# Backend
cd practica5-backend
npm install

# Frontend
cd practica5-frontend
npm install
```

---

## Configuración

### Backend - 

**Obtener MongoDB URI:**
1. Crear cluster en MongoDB Atlas
2. Crear usuario en Database Access
3. Permitir IP en Network Access
4. Obtener string de conexión desde "Connect"

**Obtener Google OAuth:**
1. Crear proyecto en Google Cloud Console
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Agregar URIs autorizados: `http://localhost:3000` y `http://localhost:5000/api/auth/google/callback`
5. Copiar Client ID y Client Secret

### Frontend - Variables de Entorno

Crear archivo `.env` en la raíz del frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Ejecución

### Modo Desarrollo

**Backend:**
```bash
cd practica5-backend
npm run dev
```

Debe mostrar:
```
✅ MongoDB conectado exitosamente
🚀 Servidor corriendo en http://localhost:5000
```

**Frontend:**
```bash
cd practica5-frontend
npm start
```

**Autenticación:**
- `POST /auth/registro` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/google` - Login con Google
- `GET /auth/perfil` - Obtener perfil (requiere token)

**Usuarios (requieren token):**
- `GET /usuarios` - Listar usuarios
- `GET /usuarios/:id` - Obtener usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario


---
1. **Registro:** Ir a la página principal y click en "Registrarse"
2. **Login:** Usar email/password o "Continuar con Google"
3. **Dashboard:** Ver información del perfil
4. **Usuarios:** Gestionar usuarios (crear, editar, eliminar)
5. **Logout:** Cerrar sesión desde el navbar

