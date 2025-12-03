const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {

    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      next();
    });
  };
};

module.exports = authMiddleware;
