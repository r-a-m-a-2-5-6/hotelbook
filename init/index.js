const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/init.js");

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

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data =initdata.data.map((data) =>({...data, owner :"67302c890cdfa8d9d2dfcabd"}))
    await Listing.insertMany(initdata.data);
    console.log("data was intialised")
}

initDB();
