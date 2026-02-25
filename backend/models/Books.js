const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    publishedDate: {
        type: Date,
        required: [true, 'Published date is required'],
        min: [new Date('1500-01-01'), 'Published date must be after January 1, 1500'],
        max: [new Date(), 'Published date cannot be in the future']
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price: {
        type:Number,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});

module.exports=mongoose.model('Books',bookSchema);