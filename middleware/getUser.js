const jwt = require("jsonwebtoken");

const getUserMiddleMan = (req, res, next) => {
  const getUserHeader = req.headers.authorization;

  if (!getUserHeader || !getUserHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  const token = getUserHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ match your login payload
    req.user = { id: payload.id };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not You FAM" });
  }
};

module.exports = getUserMiddleMan;
