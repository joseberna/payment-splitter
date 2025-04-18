import express from "express";
import dotenv from "dotenv";
import { handleSendPayment, handleGetStatus } from "./controllers/paymentController";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/send-payment", handleSendPayment);
app.get("/status", handleGetStatus);

app.listen(3000, () => {
  console.log("🚀 Backend running at http://localhost:3000");
});