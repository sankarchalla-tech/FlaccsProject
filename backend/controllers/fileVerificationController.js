import * as verificationService from "../services/fileVerificationService.js";

export async function verifyLibrary(req,res){

    try{

        const result =
        await verificationService.verifyLibrary();

        res.json(result);

    }

    catch(err){

        res.status(500).json({

            error:err.message

        });

    }

}