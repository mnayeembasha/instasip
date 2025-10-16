import {createClient} from "redis";
import { REDIS_URL } from "../config";

const redisClient = createClient({
    url: REDIS_URL
});

redisClient.on("error",(error:Error)=>{
    console.error("Redis Client Error",error);
});

export const connectRedis = async()=>{
     try{
        if(!redisClient.isOpen){
            await redisClient.connect();
            console.log("Connected to redis");
        }
     }catch(error){
        console.error("Error connecting to redis",error);
     }
}



export default redisClient;


