const mongoose=require('mongoose')
const mongoURI='mongodb+srv://Sak12:Saxena@cluster0.os363zi.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('Connected to mongoose successfully');
    })
}

module.exports=connectToMongo;