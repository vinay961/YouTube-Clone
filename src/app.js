import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

// use method is basically used when we works with middlewares

app.use(cors())  // allows your server to handle requests coming from different origins or domains
app.use(express.json({limit: "16kb"})) // This middleware is used to parse incoming request bodies with JSON payloads
app.use(express.urlencoded({extended: true,limit: "16kb"})) // This middleware is used to parse incoming request bodies with URL-encoded payloads
app.use(express.static("public")) // This middleware is used to serve static files such as images, CSS files, JavaScript files, etc., from the specified directory (public in this case)
app.use(cookieParser()) // This allows you to access the cookies sent by the client in subsequent request handlers


// router
import userRouter from './routes/user.route.js'


// router declaration
app.use('/api/v1/users',userRouter)

export {app}