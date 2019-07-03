const jwt = require('jsonwebtoken');

module.exports = async function tokenAuth(req, res, next) {
  const token = req.headers['x-access-token'];
  const decoded = await jwt.verify(token, process.env.SECRET);
  if (decoded) {
      next()
  } else {
      const error = new Error('Unauthorized')
      error.status = error.statusCode = 401
      next(error)
  }
}