const mongoose=require('mongoose')
const mongoURI=process.env.DATABASE
mongoose.set('strictQuery', false)
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('Connected to mongoose successfully');
    })
}

module.exports=connectToMongo;