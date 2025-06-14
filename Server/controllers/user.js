export const register = async (req, res) => {
    try{
        res.send("Register API")
    }
    catch(error){
        res.status(500).json({
            message: error.message,
        });
    }
}