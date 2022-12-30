const express = require('express');
const app = express()
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const checkAuth = require('./api/midleware/checkAuth')
require('dotenv/config')
const userRoutes = require('./api/routes/user')
const projectRoutes = require('./api/routes/project')
const requestRoutes = require('./api/routes/request')
const teamRoutes = require('./api/routes/Team')


const port = process.env.PORT || 8000

//middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors('*'))

const mongodbURL = process.env.DB_URL
// console.log(mongodbURL,"mongodbURl")
mongoose.connect(mongodbURL,
    { useUnifiedTopology: true, useNewUrlParser: true }).then(() => console.log('connected'));

// run server
app.listen(port, () => {
    console.log(`Server starts at ${port}`)
})


//Routes 
app.use('/auth',userRoutes)
app.use('/project',projectRoutes)
app.use('/request',requestRoutes)
app.use('/team',teamRoutes)


// check that user is authorized or not
// console.log('auht')
// app.use(checkAuth())
// console.log('auht after')


// error handling
app.use((res, req, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})