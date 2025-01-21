import express from 'express'
import cors from 'cors'
import { connectDb } from './config/mongodbConnection.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { createUser,getUserByEmail } from './models/user/UserModels.js';
import { createTransaction, deleteManyTransactions, deleteTransaction, getTransaction } from './models/transaction/TransactionModel.js';

// dotenv.config();  not necessary as it is injected in run command 

const app = express();
app.use(express.json())
app.use(cors());

//Connecting to database
connectDb();

app.post("/api/v1/ft/users/register",async (req,res)=>{
    try {
        const {username , email}= req.body;
        let {password}= req.body;
    
        // hashing the passwrd using plainpassword and saltedRounds 
        const saltedRounds = await bcrypt.genSalt() || 10;
        password = await bcrypt.hash(password,saltedRounds)
        const data= await createUser({
            username,
            email,
            password
        })
    
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
        const userData = await getUserByEmail(email)
        if (userData) {
            const loginSuccess= await bcrypt.compare(password,userData.password);
            if (loginSuccess) {
                // Creating token and sending as a response
                const tokenData = {
                    email: userData.email
                }

                const token = await jwt.sign(
                    tokenData,
                    process.env.JWT_SECRET_KEY,
                    {   
                        algorithm: 'HS256',
                        expiresIn:process.env.JWT_EXPRIES_IN
                    });

                res.status(200).json({
                    staus:"success",
                    message:"login succesfull",
                    accesToken:token
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
        console.log(error);
        res.status(500).json({
            staus:"error",
            message:"login error",
            error
        })
    }
})

app.post("/api/v1/ft/transactions",async (req,res) => {
    try {
        const token = req.headers.authorization;

        const decodedData = await jwt.verify(token,process.env.JWT_SECRET_KEY)

        if(decodedData?.email){

            const userData = await getUserByEmail(decodedData.email);

            if(userData){

                const{type, description, amount, date}=req.body;

                const newCreatedData= await createTransaction({
                    userId:userData._id,
                    type,
                    description,
                    amount,
                    date
                });
                res.status(201).json({
                    status:"success",
                    message:"transaction created",
                    newCreatedData
                })
            }else{
                res.status(404).json({
                    status:"error",
                    message:"user not found"
                })
            }

            
        }else{
            res.status(401).json({
                status:"error",
                message: "No payload"
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:"error",
            message:"Error while creating transacrion"
        })
    }
})

app.get("/api/v1/ft/transactions", async (req, res) => {
    try {
        const token = req.headers.authorization;

        const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decodedData?.email) {
            const userData = await getUserByEmail( decodedData.email);

            if (userData) {
                const transactionData = await getTransaction(userData._id);
                res.status(200).json({
                    status: "success",
                    transactionData
                });
            } else {
                res.status(404).json({
                    status: "error",
                    message: "user not found"
                });
            }
        } else {
            res.status(401).json({
                status: "error",
                message: "No payload"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error while fetching transactions"
        });
    }
});

app.delete("/api/v1/ft/transactions/:tid",async (req,res) => {
    try {
        const token = req.headers.authorization;

        const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decodedData?.email) {
            const userData = await getUserByEmail(decodedData.email);

            if (userData) {
                const transactionData = await deleteTransaction(
                    req.params.tid,
                    userData._id
                );

                if (transactionData){
                    res.status(200).json({
                        status: "success",
                        message:"item deleted"
                    });
                }else{
                    res.status(500).json({
                        status: "error",
                        message:"Error while deleting transaction"
                    });
                }
            } else {
                res.status(404).json({
                    status: "error",
                    message: "user not found"
                });
            }
        } else {
            res.status(401).json({
                status: "error",
                message: "No payload"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error while deleting transactions"
        });
    }
})

app.delete("/api/v1/ft/transactions",async (req,res) => {
    try {
        const token = req.headers.authorization;

        const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decodedData?.email) {
            const userData = await getUserByEmail(decodedData.email);

            if (userData) {

                const transactionsids=req.body.transactionsid;


                const transactionData = await deleteManyTransactions(transactionsids,userData._id)

                if (transactionData){
                    res.status(200).json({
                        status: "success",
                        message: transactionData.deletedCount+ "  transactions deleted"
                    });
                }else{
                    res.status(500).json({
                        status: "error",
                        message:"Error while deleting transactions"
                    });
                }
            } else {
                res.status(404).json({
                    status: "error",
                    message: "user not found"
                });
            }
        } else {
            res.status(401).json({
                status: "error",
                message: "No payload"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            message: "Error while deleting transactions"
        });
    }
})
//starting the server
const PORT = process.env.PORT || 9090 ;
app.listen(PORT,(error)=>{
    error 
    ? console.log(error)
    :console.log('server started at '+ PORT);
})