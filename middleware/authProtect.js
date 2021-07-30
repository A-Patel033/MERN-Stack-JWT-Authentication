import jwt  from "jsonwebtoken";
import User from "../models/userModels.js";
import ErrorResponse from "../utils/errorResponse.js";


const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrorResponse("Not Authorized to access this route", 401));
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decode);
        const user = await User.findById(decode.id);
        if (!user) {
            return next(new ErrorResponse("No user found with this id", 404));
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
}

// export default protect;

export {protect};