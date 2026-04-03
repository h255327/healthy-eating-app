const adminService = require('../services/admin.service');

async function getUsers(req, res) {
  // TODO: return list of all users (admin only)
  res.json({ message: 'getUsers – not implemented' });
}

async function deleteUser(req, res) {
  // TODO: delete a user by id (admin only)
  res.json({ message: 'deleteUser – not implemented' });
}

async function getStats(req, res) {
  // TODO: return app-wide statistics
  res.json({ message: 'getStats – not implemented' });
}

module.exports = { getUsers, deleteUser, getStats };
