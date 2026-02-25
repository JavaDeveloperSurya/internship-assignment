const argon2 = require('argon2');
const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
},{timestamps:true});

adminSchema.pre('save',async function(){
    if (this.isModified('password')){
        this.password = await argon2.hash(this.password);
    }
    else{
        return;
    }
})

adminSchema.methods.isPasswordValid=async function(password){
    return await argon2.verify(this.password,password);
}

module.exports=mongoose.model('Admin',adminSchema);