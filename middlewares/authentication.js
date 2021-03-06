const jwt      = require('jsonwebtoken')
const node_env = process.env.NODE_ENV || 'development'
const { SEED } = require('../config/config')[node_env]

const getToken = function (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
    return req.headers.authorization.split(' ')[1]
  } else if (req.query && req.query.token) {
    return req.query.token
  } else if (req.cookies && req.cookies.token) {
    return req.cookies.token
  }
  // If we return null, we couldn't find a token.
  // In this case, the JWT middleware will return a 401 (unauthorized) to the client for this request
  return null 
}
// Verificar token
exports.verifyToken = function(req, res, next) {
  // const { token } = req.query
  const token = getToken(req)
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        message: 'Token incorrecto',
        errors: err,
      })
    }
    req.user = decoded.user
    // next(decoded.user)
    next()
  })
}

// Verificar Admin
exports.verifyAdmin = function(req, res, next) {
  const { user } = req
  if (user.is_admin) {
    next()
    return
  }
  return res.status(403).json({
    ok: false,
    message: 'Token incorrecto',
    errors: { message: 'Forbidden' },
  })
}

// Verificar Admin o mismo usuario
exports.verifyAdminOrSelfUser = function(req, res, next) {
  const { user } = req
  const { id } = req.params
  if (user.is_admin || user._id === id) {
    next()
  } else {
    return res.status(403).json({
      ok: false,
      message: 'No puede eliminarse asi mismo un usuario',
      errors: { message: 'Forbidden' },
    })
  }
}