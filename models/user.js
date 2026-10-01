const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
    }
})

//username and password salting hashing  field autometically created by passportLocalMongoose
//also add some method 
userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User",userSchema);

module.exports = User;