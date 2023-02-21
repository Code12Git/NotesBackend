const connectToMongo=require('./database/db')
const express=require('express')
connectToMongo();
var cors = require('cors')
const app = express()

const port=process.env.PORT||5000;
app.use(cors())

app.use(express.json())
app.use('/api/auth',require('./router/auth'))
app.use('/api/notes',require('./router/notes'))


app.listen(port,()=>{
    console.log(`Server is up on PORT: ${port}`)
})