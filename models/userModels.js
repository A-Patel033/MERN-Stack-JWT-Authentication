import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Please provide valid email."]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// userSchema.methods = ("getResetPassworToken", () => {
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
//     this.resetPasswordExpire = Date.now() + 10 * (60 * 100);
//     return resetToken
// })


const User = mongoose.model("User", userSchema);

export default User;