import express from 'express'
import cors from 'cors'
import { connectDb } from './config/mongodbConnection.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

// dotenv.config();  not necessary as it is injected in run command 

const app = express();
app.use(express.json())
app.use(cors());

//Connecting to database
connectDb();


// userSchema and model

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})
const User = mongoose.model("user",userSchema);

const PORT = process.env.PORT || 9090 ;

app.post("/api/v1/ft/users/register",async (req,res)=>{
    try {
        const {username , email}= req.body;
        let {password}= req.body;
    
        // hashing the passwrd using plainpassword and saltedRounds 
        const saltedRounds = await bcrypt.genSalt() || 10;
        password = await bcrypt.hash(password,saltedRounds)
    
        const newUser = new User({
            username,
            email,
            password
        });
        const data= await newUser.save();
    
        res.status(201).json({
            status:"success",
            message:"user created",
            data
        })
    } catch (error) {

        if(error?.message.includes("E11000")){
           return res.status(400).json({
                staus:"Error",
                message:"This user email already present"
            })
        }

        res.status(500).json(
            {
                status:"error",
                message:"Error while creating the user",
                error : error
            }
        )
    }
})

app.post("/api/v1/ft/users/login",async (req,res)=>{
    try {
        const {email ,password}=req.body;
        const userData = await User.findOne({email})
        if (userData) {
            const checkpassword= await bcrypt.compare(password,userData.password);
            if (checkpassword) {
                res.status(200).json({
                    staus:"success",
                    message:"login succesfull"
                })
            }else{
                res.status(403).json({
                    staus:"error",
                    message:"Credintals unmatched !!!"
                })
            }
            
        }else{
            res.staus(404).status({
                staus:"error",
                message:"login error"
            })
        }
    } catch (error) {
        res.status(500).json({
            staus:"error",
            message:"login error",
            error
        })
    }
})

app.listen(PORT,(error)=>{
    error 
    ? console.log(error)
    :console.log('server started at '+ PORT);
})