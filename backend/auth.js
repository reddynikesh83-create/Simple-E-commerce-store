const crypto = require('crypto');

// Secret key for HMAC token signing
const JWT_SECRET 

/**
 * Hash password with salt using PBKDF2
 * @param {string} password 
 * @returns {{ salt: string, hash: string }}
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

/**
 * Verify password against salt and hash
 * @param {string} password 
 * @param {string} salt 
 * @param {string} originalHash 
 * @returns {boolean}
 */
function verifyPassword(password, salt, originalHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === originalHash;
}

/**
 * Generate a signed JWT-compatible token without needing external C-bindings
 * @param {object} payload 
 * @param {number} expiresInHours 
 * @returns {string} token
 */
function generateToken(payload, expiresInHours = 24) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const expiresAt = Date.now() + expiresInHours * 60 * 60 * 1000;
  const tokenPayload = { ...payload, exp: expiresAt };

  const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const base64Payload = Buffer.from(JSON.stringify(tokenPayload)).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64url');

  return `${base64Header}.${base64Payload}.${signature}`;
}

/**
 * Verify signed token
 * @param {string} token 
 * @returns {object|null} payload or null if invalid
 */
function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return null; // Expired
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Express middleware for authenticating requests
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }

  req.user = user;
  next();
}

/**
 * Optional authentication middleware: attaches user if present, doesn't block if not
 */
function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  authMiddleware,
  optionalAuthMiddleware
};
