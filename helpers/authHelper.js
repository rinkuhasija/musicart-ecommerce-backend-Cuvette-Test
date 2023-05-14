const bcrypt = require("bcrypt");

 const hashPassword = async(password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash( password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}

 const comparePassword = async(password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        console.log(error);
    }
}

//export
module.exports = hashPassword, comparePassword ;