const asyncHandler = (requestHandler) => {
    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
}

export {asyncHandler}


// Another way to this is given below

// const asyncHandlerDemo = (func) => async(req,res,next) => {
//     try{
            // func(req,res,next)
//     }catch(err){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }