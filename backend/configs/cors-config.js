const cors=require('cors');
const corsConfig=()=>{
    return cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
}

module.exports = corsConfig;