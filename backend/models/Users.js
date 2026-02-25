const mongoose = require('mongoose');
const argon2 = require('argon2');
const userSchema = new mongoose.Schema({
    fullName: { 
        type: String, 
        required: [true,'name can not be empty'], 
        trim: true 
    },
    email: {
        type: String,
        required: [true,'email can not be empty'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true,'password can not be empty']
    },
    gender: {
        type: String,
        required: [true,'gender can not be empty']
    },
    address: {
        type: String,
        required: [true,'address can not be empty'],
        trim: true
    },
    books: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Books',
        default: []
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});


// password hashing before saving the user document
userSchema.pre('save', async function () {
    if (this.isModified('password')){
        this.password = await argon2.hash(this.password);
    }
    else{
        return;
    }
});

// method to compare the password during login
userSchema.methods.isPasswordValid = async function (password) {
    return await argon2.verify(this.password, password);
};

module.exports=mongoose.model('Users',userSchema);