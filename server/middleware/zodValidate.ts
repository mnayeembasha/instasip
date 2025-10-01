import {ZodObject, ZodError} from "zod";
import {type Request,type Response,type NextFunction} from "express";
export const zodValidate = (schema:ZodObject,sendAllErrors:boolean = false,parseQueryParams:boolean = false) => (req:Request, res:Response, next:NextFunction)  => {
    try{
        if(parseQueryParams){
            schema.parse(req.query);
        }else{
            schema.parse(req.body);
        }
        next();
    }catch(error){
        if(error instanceof ZodError){
            if(sendAllErrors){
                const formattedErrors = error.issues.map(issue => ({
                    field:issue.path[0],
                    message:issue.message
                }));
                return res.status(400).json({
                    message:"validation failed",
                    errors:formattedErrors
                });

            }else{
                const firstError = error.issues[0];
                return res.status(400).json({
                    field:firstError?.path[0],
                    error:firstError?.message,
                    message:"validation failed"
                });
            }
        }
    }
}