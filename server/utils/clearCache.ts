import redisClient from "../lib/redisClient"

export const clearProductCache = async () => {
    try {
        const cacheKeys = await redisClient.sMembers("product:cacheKeys");
        if (cacheKeys.length > 0) {
            await redisClient.del(cacheKeys);
            await redisClient.del("product:cacheKeys");
            console.log("Product cache cleared");
        }
    } catch (error) {
        console.error("Error clearing product cache:", error);
    }
};
