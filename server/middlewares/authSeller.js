import jwt from "jsonwebtoken"

const authSeller = async(req,res,next)=>{
    const {sellerToken} = req.cookies;

    if(!sellerToken){
        // return res.json({success:false,message:"Not Authorized"})
       return res.json({ success: false, message: "Not Authorized" });
                    }
        try{   
            const tokenDecode = jwt.verify(sellerToken,process.env.JWT_SECRET)        
              if(tokenDecode.email === process.env.SELLER_EMAIL){
                  next();           
            }
            else{
                return res.json({success:false,message:'Not authorised Seller'});
             }
          
        }  catch(error){   
            res.json({success: false, message: "Token decode failed Seller: " + error.message
    });
    
     }
                                        }

export default authSeller;