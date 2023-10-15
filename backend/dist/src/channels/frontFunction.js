"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
async function createChannel(channelData, jwtToken, sessionToken) {
    const ENDPOINT_URL = 'http://localhost:4000/channels/created';
    if (!channelData || !jwtToken)
        throw new Error("Missing required parameters.");
    const headers = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };
    if (sessionToken)
        headers['Session-Token'] = sessionToken;
    try {
        const response = await axios_1.default.post(ENDPOINT_URL, channelData, { headers });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error("Failed to create channel:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || "Failed to create channel.");
    }
}
const dataChannel = {
    name: "engooh_channel",
    type: "public",
    ownerId: "95280",
    password: ""
};
createChannel(dataChannel, "tokenexample906565", "sessionexample544545");
exports.default = createChannel;
//# sourceMappingURL=frontFunction.js.map