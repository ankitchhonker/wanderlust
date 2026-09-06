import mongoose, {Schema,Document} from "mongoose";
 

export interface IListing extends Document{
    title:string;
    description:string;
    price:number;
    location:string;
    country:string;
    category:string;
    owner:Schema.Types.ObjectId
}
const fieldProperty = {
    type:String,required:true,
}

const listingSchema = new Schema<IListing>({
   title: fieldProperty,
   description:fieldProperty,
   price:{type:Number,required:true},
   location:fieldProperty,
   country:fieldProperty,
   category:fieldProperty,
   owner:{type:Schema.Types.ObjectId,ref:"User"}
})

const Listing = mongoose.model<IListing>("Listing",listingSchema);
export default Listing;
