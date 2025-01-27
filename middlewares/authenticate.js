import jwt from 'jsonwebtoken'
import { getUserByEmail } from '../models/user/UserModels.js';

export const authenticate = async (req, res, next ) => {
     try {
        const token = req.headers.authorization;
    
            const decodedData = await jwt.verify(token,process.env.JWT_SECRET_KEY)
    
            if(decodedData?.email){
    
                const userData = await getUserByEmail(decodedData.email);
    
                if(userData){
                    req.userData=userData;
                    next();
                }else{
                   return res.status(404).json({
                        status:"error",
                        message:"user not found"
                    })
                }
            }else{
               return res.status(401).json({
                    status:"error",
                    message: "No payload"
                })
            }
        } catch (error) {
        res.status(401).send({
            status:"error",
            message:"Authentication failled",
            errormsg:error.message
        })
    }
}