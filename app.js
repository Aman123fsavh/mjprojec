const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}



app.set("views engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));




//index route 

app.get("/listing", async (req,res)=>{
  const allListing = await Listing.find({})
   res.render("./listings/index.ejs",{allListing});
});


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

//new listing

app.get("/listing/new" , (req,res)=>{
  res.render("listings/new.ejs")
})

//create route
app.post("/listings",async (req,res)=>{
  //  let {title,citr} =req.body;
  // let listings =req.body.listings;
  // console.log(listings);

  const newListing= new Listing(req.body.listings);
  await newListing.save();
  res.redirect("/listing")


});


//show route 
app.get("/listing/:id", async (req, res)=>{
  let {id}= req.params;
  const list = await Listing.findById(id);
  res.render("listings/show.ejs", {list})
  
})


// edit route

app.get("/listing/:id/edit", async (req,res)=>{
let {id}= req.params;
const listing =await Listing.findById(id);
res.render("listings/edit.ejs",{listing});

});

//update route 
app.put("/listing/:id",async(req,res)=>{
  let {id} =req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listings});
  res.redirect(`/listing/${id}`);

});
//delete  route
app.delete("/listings/:id",async(req,res)=>{
  let {id}= req.params;
  let  deletelisting =await Listing.findByIdAndDelete(id);
   console.log(deletelisting);
   res.redirect("/listing")
})



app.listen(8080, () => {
  console.log("server is listening to port 8080");
});