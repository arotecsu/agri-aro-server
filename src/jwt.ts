const { sign, verify } = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_KEY;

function generateToken(payload) {
  const token = sign(payload, JWT_KEY, {
    expiresIn: 60 * 60 * 24 * 30,
    //s * min * hour * day
  });

  return token;
}

function verifyToken(token: string) {
  try {
    var decoded = verify(token, JWT_KEY);
    return decoded;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}
export { generateToken, verifyToken };
