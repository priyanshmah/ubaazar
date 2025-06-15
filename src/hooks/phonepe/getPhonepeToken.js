import redis from "@/helpers/redis/redisInstance";
import axios from "axios";

const TOKEN_KEY = "phonepe:token";

export default async function getPhonepeToken() {
  const cached = await redis.get(TOKEN_KEY);

  if (cached) return cached;

  const token = await getAccessToken();
  return token;
}

const getAccessToken = async () => {
  try {
    const authUrl = process.env.PHONEPE_AUTH_URL;

    const bodyData = new URLSearchParams({
      client_id: process.env.PHONEPE_CLIENT_ID || "",
      client_version: process.env.PHONEPE_CLIENT_VERSION || "",
      client_secret: process.env.PHONEPE_CLIENT_SECRET || "",
      grant_type: "client_credentials",
    });

    const response = await axios.post(`${authUrl}/v1/oauth/token`, bodyData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = response.data;

    if (data?.access_token) {
        console.log("access token received: ", data.access_token);
        
      await redis.set(TOKEN_KEY, data.access_token, {ex: 840});
      return data.access_token;
    } else {
      console.error("Token not received from PhonePe");
      return null;
    }
  } catch (error) {
    console.error("Error getting access token:", error?.response?.data || error);
    return null;
  }
};
