const authService = require('../services/auth.service');

async function register(req, res) {
  // TODO: validate input, call authService.register
  res.json({ message: 'register – not implemented' });
}

async function login(req, res) {
  // TODO: validate input, call authService.login, return JWT
  res.json({ message: 'login – not implemented' });
}

async function logout(req, res) {
  // TODO: invalidate token / clear session
  res.json({ message: 'logout – not implemented' });
}

module.exports = { register, login, logout };
