// import "dotenv/config"
// import cookieParser from 'cookie-parser';

// import express from 'express';
// import cors from 'cors';
// import connectDB from "./configs/db.js";

// import userRouter from './routes/userRoute.js';
// import sellerRouter from './routes/sellerRoutes.js';
// import connectCloudinary from './configs/cloudinary.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import addressRouter from './routes/addressRoute.js';
// import orderRouter from './routes/orderRoute.js';
// import { stripeWebhooks } from "./controllers/orderController.js";

// const app=express();
// const port= process.env.PORT || 4000;


// await connectDB();
// connectCloudinary();
// // Allow multiple origins 
// const allowedOrigins=['http://localhost:5174','https://greencartfrontend-three.vercel.app']

// app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

// // Middleware Configuration
// app.use(express.json())
// app.use(cookieParser())
// app.use(cors({origin:allowedOrigins,credentials:true}));

// app.get("/",(req,res)=>res.send("API is working"));
// app.use("/api/user",userRouter)
// app.use("/api/seller",sellerRouter)
// app.use("/api/product",productRouter)
// app.use('/api/cart',cartRouter)
// app.use('/api/address',addressRouter)
// app.use('/api/order',orderRouter)


// app.listen(port, async()=>{
    
//     console.log(`Server is running on http://localhost:${port}`)
// })

// // Hello kishan


import "dotenv/config"
import cookieParser from 'cookie-parser';

import express from 'express';
import cors from 'cors';
import connectDB from "./configs/db.js";

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 4000;

await connectDB();
connectCloudinary();

// ✅ FIX 1: Added localhost:5173 just to be safe
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://greencartfrontend-three.vercel.app'
];

// Stripe Webhook MUST be before express.json() - You did this perfectly!
app.post('/stripe', express.raw({type:'application/json'}), stripeWebhooks);

// ✅ FIX 2: Move CORS higher up, and use the dynamic function check
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Crucial for cross-origin cookies!
}));

// Middleware Configuration
app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
});