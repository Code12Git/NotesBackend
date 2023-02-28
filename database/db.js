const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const mongoURI=process.env.DATABASE
mongoose.set('strictQuery', false)
mongoose.connect(mongoURI,{
    useNewUrlParser:true,
   
    useUnifiedTopology:true,
    
}).then(()=>{
    console.log('Connection established')
}).catch((error)=>{
    console.log(error)
})

;