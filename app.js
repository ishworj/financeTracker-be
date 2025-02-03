import express from "express";
import cors from "cors";
import { connectDb } from "./config/mongodbConnection.js";
import userRouter from "./routes/userRoute.js";
import transactionRouter from "./routes/transactionRoute.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// dotenv.config();  not necessary as it is injected in run command

const app = express();
app.use(express.json());
app.use(cors());

//Connecting to database
connectDb();

app.use("/api/v1/ft/users", userRouter);

app.use("/api/v1/ft/transactions", transactionRouter);

app.use(errorHandler);
//starting the server
const PORT = process.env.PORT || 9090;
app.listen(PORT, (error) => {
  error ? console.log(error) : console.log("server started at " + PORT);
});

