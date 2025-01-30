import axios from "axios";

export const VerifyUserId=async(req,res,next)=>{
    try{
        const {email,MnnlrId} = req.body;
        if(!email||!MnnlrId){
            return res.status(401).json({success:false ,message:"email Or Emloyee Id is not Provides"}) 
        }
        const response = await axios.get(
            "https://mnnlr-backend.onrender.com/api/ms1/verifyEmpForWorkspace",
            {
            params: {
                mnnlrId: MnnlrId,
                mnnlrEmail: email
            },
            }  
          );
          if(response.status===200){
            next();
          } else{
            return res.status(404).json({ error: "User verification failed." });
          }
    }catch(error){
      const errorMessage = "User Mail ID And Employee ID does not match";
      return res.status(error.response?.status || 500).json({ success: false, message: errorMessage });
    }
  }
