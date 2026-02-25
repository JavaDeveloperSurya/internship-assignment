const cors=require('cors');
const corsConfig=()=>{
    return cors({
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://internship-assignment-ten-gules.vercel.app/"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
    })
}

module.exports = corsConfig;