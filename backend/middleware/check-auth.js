const jwt = require("jsonwebtoken");

// ene function ni token irsen requesting zuwshuuruh esvel horiglohiig shiidene
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // bid nar token salgaj avch bna token ex: "Bearer asqqwerqwer"
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated! Бүртгэгдээгүй хэрэглэгч байна!"});
  }
};
