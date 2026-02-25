const Joi = require('joi');

const bookValidation=(bookData)=>{
    const schema=Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        author:Joi.string().required(),
        publishedDate:Joi.date().required().min('1500-01-01').max('now'),
        code:Joi.string().required().trim(),
        price:Joi.number().required(),
    });
    return schema.validate(bookData);
}

module.exports=bookValidation;