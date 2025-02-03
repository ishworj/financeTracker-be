import express from 'express'
import { createTransaction, deleteManyTransactions, deleteTransaction, getTransaction } from '../models/transaction/TransactionModel.js';
import { authenticate } from '../middlewares/authenticate.js';
const router = express.Router();

router.post("", authenticate, async(req,res) => {
    try {

        const{type, description, amount, date}=req.body;

                const newCreatedData= await createTransaction({
                    userId: req.userData._id,
                    type,
                    description,
                    amount,
                    date
                });
                return res.status(201).json({
                    status:"success",
                    message:"transaction created",
                    newCreatedData
                })
        
    } catch (error) {
        console.log(error);
       return res.status(500).json({
            status:"error",
            message:"Error while creating transacrion"
        })
    }
})

router.get("",authenticate, async (req, res) => {
    try {
        const transactionData = await getTransaction(req.userData._id);
       return res.status(200).json({
            status: "success",
            transactionData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Error while fetching transactions"
        });
    }
});

router.delete("/:tid",authenticate ,async (req,res) => {
    try {
                const transactionData = await deleteTransaction(
                    req.params.tid,
                    req.userData._id
                );

                if (transactionData){
                    return res.status(200).json({
                        status: "success",
                        message:"item deleted"
                    });
                }else{
                   return res.status(500).json({
                        status: "error",
                        message:"Error while deleting transaction"
                    });
                }
           
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            message: "Error while deleting transactions"
        });
    }
})

router.delete("",authenticate ,async (req,res) => {
    try {

                const transactionsids=req.body.transactionsid;


                const transactionData = await deleteManyTransactions(transactionsids,req.userData._id)

                if (transactionData){
                    return res.status(200).json({
                        status: "success",
                        message: transactionData.deletedCount+ "  transactions deleted"
                    });
                }else{
                    return res.status(500).json({
                        status: "error",
                        message:"Error while deleting transactions"
                    });
                }
    } catch (error) {
        console.log(error);
       return  res.status(500).json({
            status: "error",
            message: "Error while deleting transactions"
        });
    }
})

export default router;