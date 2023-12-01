require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./router/index')
const resValidator = require("./middlewares/validator.middleware")
const path = require("path")
const fileupload = require("express-fileupload")

const PORT = process.env.PORT || 5000;
const app = express()

app.use(fileupload())
app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router);
app.use(resValidator) 

if(process.env.NODE_ENV === 'prod') {
    app.use('/', express.static(path.join(__dirname, '..', 'client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
    })
}

const start = async () => {
    try {
        
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
