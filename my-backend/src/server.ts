
import express from "express";
import { connectDB } from "./config/db";
import 'dotenv/config';
import listingRoutes from "./routes/listing.routes";
import authRoutes from "./routes/auth.routes";
import {Request, Response, NextFunction} from "express";
const app = express();
const PORT = process.env.PORT;
const url = process.env.ATLASDB_URL as string;
import dns from "node:dns";  
dns.setServers(["1.1.1.1", "1.0.0.1"]);

//middlewares
app.use(express.json());
app.use("/api/listing",listingRoutes);
app.use("/api/auth",authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.status(statusCode).json({ error: message });
});

connectDB(url).then(()=>{
  app.listen(PORT,()=>{
    console.log("Server is listining");
})
})


