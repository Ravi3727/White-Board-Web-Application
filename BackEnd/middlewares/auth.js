const asyncHandler = require("../Api/asyncHandler");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // console.log("auth middleware",req.body)
        // const {Token1} = req.body;
        const Token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        // console.log("token ye raha ",Token);
        if (!Token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized" 
            })
        }
        // const decodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SCERET)
        const decodedToken = jwt.verify(Token, "ravikant12345")

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("auth error in : " + error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }


})

module.exports = verifyJWT;