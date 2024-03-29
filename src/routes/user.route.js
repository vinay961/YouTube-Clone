import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.js";
import {upload} from "../middlewares/multer.js"

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name:"CoverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )
 
router.route("/login").post(loginUser)    

router.route("/logout").post(verifyJWT,logoutUser)

export default router