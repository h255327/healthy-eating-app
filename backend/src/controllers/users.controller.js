const usersService = require('../services/users.service');

async function getProfile(req, res) {
  // TODO: get authenticated user's profile
  res.json({ message: 'getProfile – not implemented' });
}

async function updateProfile(req, res) {
  // TODO: update authenticated user's profile
  res.json({ message: 'updateProfile – not implemented' });
}

async function deleteAccount(req, res) {
  // TODO: delete authenticated user's account
  res.json({ message: 'deleteAccount – not implemented' });
}

module.exports = { getProfile, updateProfile, deleteAccount };
