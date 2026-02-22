// Add Address : /api/address/add

import Address from "../models/Address.js"

export const addAddress = async(req,res)=>{
    try{
        const {address,userId}= req.body
        await Address.create({...address,userId})
        res.json({success:true,message:"Address Added successfully"})

       }
      catch(error){
         res.json({
            success: false,
            message: "Address not added",
            error: error.message
                  });
                 }
}

// Get Address : /api/address/get

// export const getAddress= async(req,res)=>{
//     try{
//         const {userId}= req.body
//         const addresses= await Address.find({userId})
//         res.json({success:true,addresses})

//       }
//     catch(error){
//          res.json({
//             success: false,
//             message: "Address not added",
//             error: error.message
//                   });     
//     }
// }

// Inside your backend address controller
export const getAddress = async (req, res) => {
    try {
        // ✅ FIX 2: Change req.body back to req.query for GET requests
        const { userId } = req.query; 
        
        const addresses = await Address.find({ userId });
        res.json({ success: true, addresses });
    } catch (error) {
        res.json({
            success: false,
            message: "Address not fetched",
            error: error.message
        });     
    }
}

export default addAddress