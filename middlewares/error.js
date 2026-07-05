

function globalError(err,req,res,next){

    let error= {...err}
    error.message=err.message
    error.statusCode=err.statusCode
    error.status=err.status
    
    console.error(error.message)

    if(err.message==="TokenExpired"){
        error.message="Token Expired"
        error.statusCode=401
        error.status="fail"
    }
    if(err.message==="Invalid Token"){
        error.message="Invalid Token"
        error.statusCode=401
        error.status="fail"
    }
    if(err.message==="Token not found"){
        error.message="Token not found"
        error.statusCode=401
        error.status="fail"
    }
    if(err.message==="Token not found"){
        error.message="Token not found"
        error.statusCode=401
        error.status="fail"
    }

    res.status(error.statusCode).json({
        status:error.status,
        message:error.message
    })
}

export default globalError