const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");
const wrapasync = require("../utils/wrapasync");
const Schema = mongoose.Schema;
const Review = require("./review.js")


main()
  .then(() => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  })
async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/hotelbook')
}

const ListSchema = new Schema({
    title:{
    type:String,
    required:true},
   description:{
      type:String
   },
    image:{
        type:String,
        default:"https://unsplash.com/photos/white-and-brown-wooden-2-storey-house-0zy0QwHwZy8",
        set :(v) => v === "" ?  "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews: [{
      type:Schema.Types.ObjectId,
      ref:"Review"
    }],
    owner: {
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
    
)
//handling delete review when listing is deleted
ListSchema.post('findOneAndDelete', wrapasync(async (listing) =>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}})
  }
}))

const Listing = new mongoose.model("Listing",ListSchema);

module.exports =Listing;
