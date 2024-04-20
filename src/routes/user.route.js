import { Router } from "express";
import { changeCurrentPassword,
         getCurrentUser,
         loginUser,
         logoutUser,
         refreshAccessToken, 
         registerUser, 
         updateAccountDetails,
         getUserChannelProfile,
         updateUserAvatar,
         updateUserCoverImage,
         getWatchHistory
        } 
        from "../controllers/user.js";
import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js";

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
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage",updateUserCoverImage))

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)


export default router