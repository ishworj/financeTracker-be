import mongoose from "mongoose"
const transactionSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:['Income','Expense'],
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    description:{
        type:String,
        default:""
    }
},{
    timestamps:true
})

export default mongoose.model("transactions",transactionSchema);