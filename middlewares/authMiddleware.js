const jwt = require("jsonwebtoken");
require('dotenv').config();



const auth = (req, res, next) => {
    const token = req.header["x-auth-token"] || req.body.token || req.query.token;

    if (!token) {
        return res.status(403)
            .send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send(`Invalid token . Error => ${err}`);
    }
    return next();
};

module.exports = auth;