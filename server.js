const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require("./model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("./model/productModel");
// const auth = require('./middleware/auth');
// const validateJobPost = require('./middleware/validateJobPost');
const app = express();

//connect to DB
connectDB();


//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//server status
app.get('/', async (req, res) => {
  try {
    res.status(200).send("Hello World");
  } catch (err) {
    res.status(500).send('Server Error', err);
  }
});

//register
app.post('/register', async (req, res) => {
  try {
    const { full_name, mobile, email, password } = req.body;

    //validate input
    if (!(email && password && full_name && mobile)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      full_name,
      mobile,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });


    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "6h",
      }
    );

    user.token = token;
    user.save();

    res.status(201).json(user);

  } catch (err) {
    console.log(err);
  }
});

//login
app.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    //validate input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // check if user exist in our database
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).send("User not found");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "6h",
        }
      );

      user.token = token;
      res.status(200).json(token);

    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
})


const earphones = [
  {
  }
  // Add more earphones as needed
];


app.post("/insertProductsData", async (req, res) => {

  try {

    // Insert the dummy data into the Product collection
    Product.insertMany(earphones)
      .then(() => {
        console.log('Dummy data inserted successfully.');
      })
      .catch((err) => {
        console.error('Error inserting dummy data:', err);
      });

      res.status(201).send("data inserted successfully")

  } catch (error) {
    console.log("data not inserted" + error);
  }

});


//get products data
app.get("/getProductsData", async (req, res) => {
  try {
    const products = await Product.find({})
    res.status(200).json(products)
  } catch (error) {
    console.log("Error getting products Detail" + error);
  }
})




app.use((req, res, next) => {
  const err = new Error("Not Found")
  err.status = 404
  next(err)
})

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server started on port 3000');
});
