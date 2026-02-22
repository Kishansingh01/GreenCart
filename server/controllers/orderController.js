// // Place Order COD : /api/order/cod

// import Product from "../models/Product.js";
// import Order from "../models/Order.js";
// import Stripe from "stripe";
// import User from "../models/User.js";


// //  Place order COD:/api/order/cod
// export const placeOrderCOD = async (req,res)=>{
//     try{
//         console.log("INCOMING ORDER DATA:", req.body);

//         const {userId,items,address}=req.body;
//         if(!address || items.length === 0){
//             return res.json({sucess:false,message:"Invalid address or length"})
//                                           }
//          // Calculate amounts using items
//          let amount= await items.reduce(async(acc,item)=>{  // acc means initial count of the account.
//             const product = await Product.findById(item.product);
//             return (await acc) + product.offerPrice * item.quantity;
//          },0)
//          // Add Tax Charge (2%)
//          amount += Math.floor(amount * 0.02); 

//          await Order.create({
//             userId,
//             items,
//             amount,
//             address,
//             paymentType:"COD",
//          });
//          return res.json({success:true,message:"Order placed successfully"})
//     }
//     catch(error){
//         res.json({
//             success: false,
//             message: "Into orderController some error is cominggg...",
//             error: error.message
//                 });

//     }
// }

// // Place order Stripe: /api/order/stripe
// export const placeOrderStripe = async (req,res)=>{
//     try{
//         const {userId,items,address}=req.body;
//         const {origin}=req.headers;

//         if(!address || items.length === 0){
//             return res.json({sucess:false,message:"Invalid address or length"})
//                                           }
//         let productData=[];

//          // Calculate amounts using items
//          let amount= await items.reduce(async(acc,item)=>{  // acc means initial count of the account.
//             const product = await Product.findById(item.product);
//             productData.push({
//             name:product.name,
//             price:product.offerPrice,
//             quantity:item.quantity,
//            })

//             return (await acc) + product.offerPrice * item.quantity;
//          },0)
//          // Add Tax Charge (2%)
//          amount += Math.floor(amount * 0.02); 

//        const order=  await Order.create({
//             userId,
//             items,
//             amount, 
//             address,
//             paymentType:"Online",
//          });

//     // Stripe Gateway Initialize     
//     const stripInstance= new Stripe(process.env.STRIPE_SECRET_KEY);

//     // Create line items for stripe

//     const line_items= productData.map((item)=>{
//         return{
//             price_data:{
//                 currency:"usd",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount: Math.floor(item.price + item.price * 0.02) * 100
//             },
//             quantity:item.quantity,
//         }
//     })

//     //  Create Session

//     const session= await stripInstance.checkout.sessions.create({
//         line_items,
//         mode:"payment",
//         success_url:`${origin}/loader?next=my-orders`,
//         cancel_url:`${origin}/cart`,
//         metadata:{
//             orderId:order._id.toString(),
//             userId,
//         }
//     })
//          return res.json({success:true,url:session.url});
//     }
//     catch(error){
//         res.json({
//             success: false,
//             message: "Into Online orderController some error is cominggg...",
//             error: error.message
//                 });

//     }
// }

// // Stripe webhooks to verify Payment  Action:/stripe
// export const stripeWebhooks= async(request,response)=>{
//     // Stripe gateway initialize
//     const stripeInstance= new stripe(process.env.STRIPE_SECRET_KEY);

//     const sig=request.headers["stripe-signature"];
//     let event;

//     try{
//         event=stripeInstance.webhooks.constructEvent(
//             request.body,
//             sig,
//             process.env.STRIPE_WEBHOOK_SECRET
//         );
//     }
//     catch(error){
//         response.status(400).send(`webhook Error:${error.message}`)
//     }
//     // Handle the event.
//     switch(event.type){
//         case "payment_intent.succeeded":{
//             const paymentIntent= event.data.object;
//             const paymentIntentId=paymentIntent.id;

//             // Getting session metsdata

//             const session= await stripeInstance.checkout.sessions.list({
//                 payment_intent: paymentIntentId,
//             });
//             const {orderId,userId} = session.data[0].metadata;
//             //Make payment as paid
//             await Order.findByIdAndUpdate(orderId,{isPaid:true})
//             // Clear userCart
//             await User.findByIdAndUpdate(userId,{cartItems:{}});
//             break;
//         }
//            case "payment_intent.payment_failed":{
//              const paymentIntent= event.data.object;
//             const paymentIntentId=paymentIntent.id;

//             // Getting session metsdata

//             const session= await stripeInstance.checkout.sessions.list({
//                 payment_intent: paymentIntentId,
//             });
//             const {orderId} = session.data[0].metadata;
//             await Order.findByIdAndDelete(orderId);
//             break;

//            }
//         default:
//             console.error(`Unhandled event type ${event.type}`)
//             break;
//     }
//     response.json({received:true})
// }


// // Get Orders by User ID : /api/order/user
// export const getUserOrders = async (req, res) => {
//     try {
//         // ✅ FIX 1: Change req.body to req.query for GET requests!
//         const { userId } = req.query; 

//         // Add a safety check just in case
//         if (!userId) {
//             return res.json({ success: false, message: "User ID is required" });
//         }

//         const orders = await Order.find({
//             userId,
//             $or: [{ paymentType: "COD" }, { isPaid: true }]
//         })
//         .populate("items.product address")
//         .sort({ createdAt: -1 });

//         res.json({ success: true, orders });
//     } catch (error) {
//         res.json({ success: false, message: error.message });    
//     }
// }

// // Get All Orders (for seller / admin) : /api/order/seller

// export const getAllOrders= async (req,res)=>{
//     try{        
//         const orders=await Order.find({
//             $or:[{paymentType:"COD"},{isPaid:true}]
//         }).populate("items.product address").sort({createdAt:-1});
//          res.json({success:true,orders})
//        }
//     catch(error){
//         res.json({success:false,message:error.message})     
//     }
// }





import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Stripe from "stripe"; // ✅ Capital S
import User from "../models/User.js";

// Place order COD: /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        console.log("INCOMING ORDER DATA:", req.body);

        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid address or length" });
        }

        // Calculate amounts using items safely
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        // Clear the user's cart after successful order
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return res.json({ success: true, message: "Order placed successfully" });
    } catch (error) {
        res.json({
            success: false,
            message: "Into orderController some error is cominggg...",
            error: error.message
        });
    }
}

// Place order Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid address or length" });
        }

        let productData = [];
        let amount = 0;

        // Calculate amounts safely
        for (const item of items) {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            amount += product.offerPrice * item.quantity;
        }

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // ✅ FIX: Correctly spelled 'stripeInstance'
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Create line items for stripe
        const line_items = productData.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        });

        // ✅ FIX: Correctly spelled 'stripeInstance'
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders&session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        return res.json({ success: true, url: session.url });
    } catch (error) {
        res.json({
            success: false,
            message: "Into Online orderController some error is cominggg...",
            error: error.message
        });
    }
}

// Stripe webhooks to verify Payment Action: /api/order/stripe-webhook
export const stripeWebhooks = async (request, response) => {
    // ✅ FIX: Capital 'S' in new Stripe()
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                // Getting session metadata
                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const session = sessions.data[0];
                if (session && session.metadata) {
                    const { orderId, userId } = session.metadata;
                    // Make payment as paid
                    await Order.findByIdAndUpdate(orderId, { isPaid: true });
                    // Clear userCart
                    await User.findByIdAndUpdate(userId, { cartItems: {} });
                }
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;

                const sessions = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId,
                });

                const session = sessions.data[0];
                if (session && session.metadata) {
                    const { orderId } = session.metadata;
                    await Order.findByIdAndDelete(orderId);
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }
        response.json({ received: true });
    } catch (err) {
        console.error("Webhook processing error:", err);
        response.status(500).json({ error: 'Webhook handler failed' });
    }
}

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const orders = await Order.find({ userId })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Verify Stripe Payment : /api/order/verify
// Called by frontend after Stripe redirects back — sets isPaid:true without needing webhooks
export const verifyStripePayment = async (req, res) => {
    try {
        const { sessionId, orderId } = req.query;

        if (!sessionId || !orderId) {
            return res.json({ success: false, message: "Missing sessionId or orderId" });
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // Retrieve the session from Stripe to check payment status
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            // Mark order as paid in DB
            await Order.findByIdAndUpdate(orderId, { isPaid: true });

            // Clear the user's cart in DB
            const { userId } = session.metadata;
            if (userId) {
                await User.findByIdAndUpdate(userId, { cartItems: {} });
            }

            return res.json({ success: true, message: "Payment verified and order updated" });
        } else {
            // Payment failed or pending — delete the pending order
            await Order.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}