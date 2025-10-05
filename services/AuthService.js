import JWT from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const CreateToken = async (user) => {
    try {
        const payload = {
            id: user.id,
            email: user.email
        };

        return JWT.sign(payload, JWT_SECRET);
    } catch (error) {
        console.log("Error - AuthService - CreateToken - ", error);
    }
}
export const checkToken = async (token) => {
    try {
        return JWT.verify(token, JWT_SECRET);
    } catch (error) {
        console.log("Error - AuthService - checkToken - ", error);
    }
}