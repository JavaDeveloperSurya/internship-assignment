const rateLimit=require('express-rate-limit');

const endpointRatelimit=rateLimit({
    windowMs:15*60*1000,
    max:10,
    standardHeaders:true,
    legacyHeaders:false,
    handler:(req,res)=>{
        const retryAfter = Math.ceil(req.rateLimit.resetTime / 1000);
        console.error(`endpoint request limit exceds ${req.ip}`)
        res.status(429).json({
            success:false,
            message:`Too many requests. Try again in ${retryAfter} seconds.`
        });
    }
});

module.exports=endpointRatelimit;