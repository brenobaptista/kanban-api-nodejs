/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).send({
      message: 'Not authenticated.',
    });
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'gabriela');
  } catch (error) {
    res.status(500).send({
      message: error.message || 'Some error occurred while verifying the token',
    });
  }
  if (!decodedToken) {
    return res.status(401).send({
      message: 'Not authenticated.',
    });
  }
  req.userId = decodedToken.userId;
  next();
};
