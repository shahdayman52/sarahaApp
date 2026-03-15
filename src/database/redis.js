import { createClient } from "redis";
import { env } from "../../config/index.js";

export const client = createClient({
  url: env.redis_uri,
});

client.on("error", function (err) {
  throw err;
});

export const connectRedis = async () => {
  try {
    await client.connect();
    console.log("reddis connected");
  } catch (error) {
    console.log(error);
  }
};
