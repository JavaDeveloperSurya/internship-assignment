const cors=require('cors');
const corsConfig=()=>{
    return cors({
        origin:(origin,callback)=>{
            const allwedOrigin=[
                'http://localhost:3000',
                'http://localhost:5000'
            ];
            if(!origin || allwedOrigin.indexOf(origin) !==-1 ){
                callback(null,true) //permission granted to access 
            }else{
                callback(new Error('not allowed by cors'))
            }
        },
        methods:['GET',"POST",'PUT','DELETE'],
        allowedHeaders:["Content-Type","Authorization","Accept-Version"],
        exposedHeaders:["X-total-Count","Content-Range"],
        credentials:true,
        preflightContinue:false,
        maxAge:10*60,
        optionsSuccessStatus:204    
    })
}

module.exports = corsConfig;