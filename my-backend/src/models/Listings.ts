import mongoose, {Schema,Document} from "mongoose";
 

export interface IListing extends Document{
    title:string;
    description:string;
    price:number;
    location:string;
    country:string;
    category:string;
    image:{
        url: string,
        filename: string
    } ;
    owner:Schema.Types.ObjectId;
    reviews:mongoose.Types.ObjectId[];
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
   image:{
    url:String,
    filename:String
   },
   category:fieldProperty,
   owner:{type:Schema.Types.ObjectId,ref:"User"},
   reviews:[{type:Schema.Types.ObjectId,ref:"Review"}]
})

const Listing = mongoose.model<IListing>("Listing",listingSchema);
export default Listing;
