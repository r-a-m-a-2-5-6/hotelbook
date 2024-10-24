const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");
const Schema = mongoose.Schema;


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
        set :(v) => v === "" ? "https://unsplash.com/photos/white-and-brown-wooden-2-storey-house-0zy0QwHwZy8" :v,
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
    }}
)

const Listing = new mongoose.model("Listing",ListSchema);

module.exports =Listing;