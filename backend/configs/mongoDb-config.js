const mongoose=require('mongoose');

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDb connected successfully');
    } catch (error) {
        console.error('MongoDb configuration error',error);
    }
}

module.exports=connectDb;