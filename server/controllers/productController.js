import {v2 as cloudinary} from "cloudinary";
import Product from "../models/Product.js";

// Add Product : api/product/add

export const addProduct = async(req,res)=>{
    try{
         console.log("Cloudinary Config:", cloudinary.config());
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        let productData= JSON.parse(req.body.productData)
        const images = req.files

        let imagesUrl= await Promise.all(
            images.map( async(item)=>{
                let result= await cloudinary.uploader.upload(item.path,
                    {resource_type:'image'});
                    return result.secure_url
            })
        )
        await Product.create({...productData,image:imagesUrl})
        res.json({success:true,message:"Product Added "})

    }catch(error){
       res.json({
            success: false,
            message: "Product not added",
            error: error.message
                });

    }

}

// Get Product : api/product/list
export const productList = async(req,res)=>{
    try{
        const products= await Product.find({})
        res.json({success:true,products})
    } catch(error){
         res.json({
         success: false,
         message: "ProductList not added",
         error: error.message
                  });

    }}

// Get Single Product : api/product/id
export const productById = async(req,res)=>{
    try{
        const {id}= req.body
        const product= await Product.findById(id)
        res.json({success:true,product})
      }
    catch(error){
        res.json({
         success: false,
         message: "ProductID not added",
         error: error.message
                  });

    }

}

// Change Product in Stock : /api/product/stock
export const changeStock= async(req,res)=>{
    try{
        const {id,inStock} = req.body
        await Product.findByIdAndUpdate(id,{inStock})
        res.json({success:true,message:"Stock Updated.."})
      } catch(error){
         res.json({
         success: false,
         message: "ProductID not added",
         error: error.message
                  });
      }

}
