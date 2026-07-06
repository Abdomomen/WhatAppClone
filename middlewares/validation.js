const validate=(schema)=>{
    return (req,res,next)=>{
        const result=schema.safeParse(req.body)
        if(!result.success){
            throw new Error(result.error.issues[0].message)
        }
        next()
    }
}

export default validate