import User from "../models/userModels.js";
import bcrypt from 'bcrypt';
import ErrorResponse from '../utils/errorResponse.js';
import generateToken from "../utils/generateToken.js";
import crypto from 'crypto';
import { sendMail } from "../utils/sendMail.js";

const register = async (req, res, next) => {
    const Password  = req.body.password;
    const username = req.body.username;
    const email = req.body.email;

    try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(Password, salt);
        const user = await User.create({
            username,
            email,
            password
        })
        sendToken(user, 201, res);
    } catch (error) {
        next(error);
        console.log(error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    try {
        const user = await User.findOne({ email: email }).select("+password");
        console.log(user.password, user.email); 
        if (!user) {
            return next(new ErrorResponse("Invalied credentials, Login Falied", 401));
        }
        const isMatch =  await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalied credentials, Login Falied", 401));
        }
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

const forgotPassword = async (req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});
        console.log(user);
        if(!user){
            return next(new ErrorResponse("Email could not sent", 404));
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const resetPasswordExpire = Date.now() + 10 * (60 * 100);
        console.log(resetToken, resetPasswordToken, resetPasswordExpire);  
        await User.findOneAndUpdate(email, {
            resetPasswordToken,
            resetPasswordExpire
        })

        const resetUrl = `http://localhost:3000/resetPassword/${resetToken}`;
        const message = `
            <h1> You have requested a reset password </h1>
            <p> Please go to this link to reset your password </p>
            <a href=${resetUrl} clicktracking=off> ${resetUrl} </a> 
        `
        try {
            const mailSend = await sendMail({
                to: user.email,
                subject: "Reset Password Link",
                text: message
            })
            res.status(200).json({success:true, data: "Email sent successfully"});
        } catch (error) {
            user.resetPasswordToken  = undefined;
            user.resetPasswordExpire  = undefined;

            await user.save();
            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (error) {
        next(error);
    }
}

const resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({resetPasswordToken: resetPasswordToken, resetPasswordExpire: {$gt: Date.now()}})
        if(!user){
            return next(new ErrorResponse("Invalid Reset Token")); 
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await User.findOneAndUpdate(resetPasswordToken, {password});

        res.status(201).json({
            success: true,
            data: "Passwrod Reset success."
        })
    } catch (error) {
        next(error);
    }
}

const sendToken = (user, statusCode, res) => {
    const token = generateToken(user._id)
    res.status(statusCode).json({success:true, token});
}


export { register, login, forgotPassword, resetPassword }