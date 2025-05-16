import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, "my_secret_key", (err, payload) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid Token" });
        }

        req.user = {
            id: payload.userId,
            username: payload.username,
            isAdmin: payload.isAdmin,
        };

        next();
    });
};
