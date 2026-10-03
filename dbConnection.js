const mongoose = require("mongoose");

connectDB =  async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/portfolio-website-CS5709-SEM-1");
        console.log("mongodb connection successful");
    }catch(err){
        console.log("DB CONNECTION ERROR: ", err);
        process.exit(1);
    }
}

module.exports = {connectDB};