import mongoose from "mongoose"

export const connectDB = async(URL:string)=>{
   try{
     const conn = await mongoose.connect(URL);
     console.log("Db connected")
   }catch(err){
    console.log("error:"+err);
   }
}
