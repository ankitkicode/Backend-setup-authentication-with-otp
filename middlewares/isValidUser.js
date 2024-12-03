import jwt from "jsonwebtoken"; 

const validUser = (req, res, next) => {
    let token = req.header("authorization"); 
 console.log(token, "token");
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    // Extract the token (assuming 'Bearer <token>' format)
    token = token.split(" ")[1];
    console.log(token, "token");

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Invalid token format."
        });
    }

    try {
  
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        console.log(decoded, "decoded");
        next(); 
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export default validUser;
