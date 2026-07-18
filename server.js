const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoute');
const tripRouter = require('./routes/tripRoute');
const globalErrorHandler = require('./middleware/globalErrorHandler');


dotenv.config()

const { PORT } = process.env

const server = express();

server.use(express.json())

server.use('/auth', authRouter)
server.use('/trips' , tripRouter);
server.use(globalErrorHandler)

server.get('/', (req , res) => {
    res.json('request received')
})


server.listen(
    PORT,
    () => {
        console.log(`server up and running http://localhost:${PORT}`)
    }
)