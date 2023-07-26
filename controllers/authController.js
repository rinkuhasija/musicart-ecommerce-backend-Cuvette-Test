const hashPassword = require("../helpers/authHelper");
const User = require("../models/userModel")
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
    try {
        const { full_name, mobile, email, password } = req.body;

        //validate input
        if (!(email && password && full_name && mobile)) {
           return res.status(400).send("All input is required");
        }

        // check if user already exist
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const hashedPassword = await hashPassword(password)

        // Create user in our database
        const user = await User.create({
            full_name,
            mobile,
            email: email.toLowerCase(),
            password: hashedPassword,
        });


        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "6d",
            }
        );

        user.token = token;
        user.save();

        res.status(201).json(user);


    } catch (error) {
        console.log(error);
        res.status(500).send({
            succes: false,
            message: "Some error occurred in registration "
        });
    }
};

module.exports = registerController ;