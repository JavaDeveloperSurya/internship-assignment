const Joi = require('joi');

const registerValidation=(userData)=>{
    const schema=Joi.object({
        fullName:Joi.string().required(),
        email:Joi.string().required().email(),
        password:Joi.string().required().min(6),
        gender:Joi.string().required(),
        address:Joi.string().required()
    });
    return schema.validate(userData);
}

const loginValidation=(userData)=>{
    const schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required().min(6)
    });
    return schema.validate(userData);
}

module.exports={
    registerValidation,
    loginValidation
}