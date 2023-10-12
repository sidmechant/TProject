import axios from 'axios';

/**
 * Sends a POST request to the server to create a new channel.
 * 
 * @function
 * @async
 * 
 * @param {Object} channelData - The data for the new channel, in accordance with the DTO.
 * @param {string} jwtToken - The JSON Web Token used for authentication.
 * @param {string} [sessionToken] - An optional session token.
 * 
 * @returns {Promise<Object>} A promise that resolves with the server's response.
 * 
 * @throws {Error} Throws an error if the request fails.
 * 
 * @example
 * const data = {
 *   name: "New Channel",
 *   type: "public",
 *   ownerId: 1234
 * };
 * 
 * const jwt = "your-jwt-token";
 * const session = "your-session-token";
 * 
 * try {
 *   const response = await createChannel(data, jwt, session);
 *   console.log(response);
 * } catch (error) {
 *   console.error("Failed to create channel:", error.message);
 * }
 */
async function createChannel(channelData: any, jwtToken: string, sessionToken: string) {
    const ENDPOINT_URL: string = 'http://localhost:4000/channels/created';
    
    if (!channelData || !jwtToken)
        throw new Error("Missing required parameters.");

    const headers: any = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    if (sessionToken)
        headers['Session-Token'] = sessionToken;

    try {
        const response: any = await axios.post(ENDPOINT_URL, channelData, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to create channel:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create channel.");
    }
}

const dataChannel = {
name: "engooh_channel",
type: "public",
ownerId: "95280",
password: ""
}

createChannel(dataChannel, "tokenexample906565", "sessionexample544545");
export default createChannel;