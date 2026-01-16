import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error(
    "Stream API key or secret is not defined in environment variables"
  );
}
export const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    const streamUserData = {
        id: userData.id,
        name: userData.name,
        image: userData.image
    };
    await streamClient.upsertUser(streamUserData);
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const createStreamToken = (userId) => {
       try {
        const userIdStr=userId.toString();
        const token = streamClient.createToken(userIdStr);
        return token;
       } catch (error) {
        console.error("Error creating Stream token:", error);
        return null;
       }
}
