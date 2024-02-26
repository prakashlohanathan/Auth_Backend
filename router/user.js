import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Model/user.js";
import { MailSender } from "../mailer.js";
import { decodeJwtToken, generateJwtToken, getCurrentDate } from "../service.js";

let router = express.Router();

//signup
router.post("/signup", async (req, res) => {
  try {
    //Find User is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "Email already registered" });
    }

    //generate hashed password
    let salt = await bcrypt.genSalt(15);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Add User to DB
    let newUser = await new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    }).save();

    //generate jwtToken
    let token = generateJwtToken(newUser._id);
    res.send({ message: "SignUp Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    //Find User is already registered
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //validate password
    let validatedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatedPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //generate jwtToken
    let token = generateJwtToken(user._id);
    res.send({ message: "Login Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//OTP Update
router.put("/set-otp", async (req, res) => {
  try {
    //Find User is already registered
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    //Generate OTP Random
    let otp = String(Math.floor(Math.random() * (9999 - 1000)));
    let date = getCurrentDate();
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { otp: { otp, date } } }
    );
    //Creating mail details
    let mailData = {
      email: user.email,
      subject: "Your One Time Password",
      message: `Your One Time Password for Auth app is "${otp}", its valid for 24hrs only`,
    };
    //Sending mail
    let mail = await MailSender({ data: mailData });
    let msg = mail ? "Mail sent" : "Error sending mail";

    res.send({ message: msg,otp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//OTP Verification
router.put("/reset-password", async (req, res) => {
  try {
    //Find User is already registered
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    let otp = req.body.otp;
    let date = getCurrentDate();
    if (otp == user.otp.otp && date == user.otp.date) {
      //generate hashed password
      let salt = await bcrypt.genSalt(15);
      let hashedPassword = await bcrypt.hash(req.body.password, salt);
      await User.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: hashedPassword } }
      );
      res.send({ message: "Password Updated Successfully" });
    } else if (otp === user.otp.otp) {
      res.send({ message: "OTP Expired" });
    } else {
      res.send({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//Get User Data
router.get("/get-user", async (req, res) => {
  try {
    let token=req.headers["x-auth"];
    let userId=decodeJwtToken(token)
    let user = await User.findById({_id:userId  });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    console.log(user,token,userId);
    res.status(200).json({ message:"user data got successfully",user});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export let authRouter = router;
