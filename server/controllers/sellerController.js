
import jwt from 'jsonwebtoken';

// Login Seller : /api/seller/login

export const sellerLogin = async(req,res)=>{
  try{
        const {email,password} = req.body;

    if(password === process.env.SELLER_PASSWORD && email=== process.env.SELLER_EMAIL){
        const token= jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7D'});

         res.cookie('sellerToken',token,
                {httpOnly:true, // Prevent javascript to prevent cookie
                secure: process.env.NODE_ENV === 'production',// Use secure cookie in production
                // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
                sameSite: 'lax', // ❗ REQUIRED
                maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
            })

            return res.json({success:true,message:"Seller LoggedIn "});
    }
    else{
        return res.json({success:false,message:"Seller Invalid credentials"});
    }

  } catch(error){
    res.json({success: false, message: "Seller Login Invalidation " + error.message});

  }
}

// Seller isAuth : /api/sellers/is-auth

// export const isSellerAuth = async (req,res)=>{
//     try{
//         // const {userId} = req.body;
//         // const user = await User.findById(userId).select("-password")
//         // return res.json({success:true,user})
//         // const user = await User.findById(req.userId).select("-password");
//         if (!user) return res.json({ success: false, message: "User not found" });
//        return  res.json({success: true, message: "Seller authenticated "});

//     }catch(error){
//         console.log("SellerisAuth",error.message);  
//         res.json({success:false,message:error.message});
//     }
// }

export const isSellerAuth = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "Seller authenticated"
        });
    } catch (error) {
        console.log("Seller isAuth", error.message);
        res.json({ success: false, message: error.message });
    }
};



//Logout User : /api/seller/logout

export const sellerlogout = async(req,res)=>{
    try{
        res.clearCookie('sellerToken',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        });
        return res.json({success:true,message:"Seller Logged Out"})
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});

    }
}