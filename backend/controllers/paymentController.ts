import { Request, Response, NextFunction } from "express";
import { sendPayment, getStatus } from "../services/paymentService";

// Controlador para manejar el envío de pagos
export const handleSendPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { amount } = req.body;

        // Validación de entrada
        if (!amount || typeof amount !== "number" || amount <= 0) {
            res.status(400).json({ error: "A valid amount is required" });
            return;
        }

        // Llamada al servicio para enviar el pago
        const result = await sendPayment(amount.toString());
        res.json({ success: true, hash: result.hash });
    } catch (error) {
        console.error("Error in handleSendPayment:", error);
        next(error); // Pasar el error al middleware de manejo de errores
    }
};

// Controlador para manejar la obtención del estado
export const handleGetStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Llamada al servicio para obtener el estado
        const status = await getStatus();
        res.json({ success: true, ...status });
    } catch (error) {
        console.error("Error in handleGetStatus:", error);
        next(error); // Pasar el error al middleware de manejo de errores
    }
};