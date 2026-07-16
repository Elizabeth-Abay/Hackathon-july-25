const express = require('express');
const dotenv = require('dotenv');
const authRouter = require('./routes/authRoute');
const globalErrorHandler = require('./middleware/globalErrorHandler');


dotenv.config()

const { PORT } = process.env

const server = express();

server.use('/auth', authRouter)
server.use(globalErrorHandler)


server.listen(
    PORT,
    () => {
        console.log(`server up and running http://localhost:${PORT}`)
    }
)