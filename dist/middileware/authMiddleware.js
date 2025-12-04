"use strict";

var jwt = require('jsonwebtoken');
var authMiddleware = function authMiddleware() {
  var roles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (req, res, next) {
    var authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
    var token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden"
        });
      }
      next();
    });
  };
};
module.exports = authMiddleware;