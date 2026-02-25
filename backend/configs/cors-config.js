const cors=require('cors');
const corsConfig=()=>{
    return cors({
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            "https://your-frontend.vercel.app"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
}

module.exports = corsConfig;