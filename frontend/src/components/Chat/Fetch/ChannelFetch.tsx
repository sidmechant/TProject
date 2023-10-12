

export const CreateChannelApi = async (name: string, type: string, password?: string) => {
    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt_token="))
        ?.split("=")[1];
    if (!token) throw new Error("Token is not available");

    const response = await fetch("", { //a completer
        method: "", //a completer
        headers: {
            "Content-Type": "application/json", //a checker
            Accept: "application/json", // a checker
            Authorization: `Bearer ${token}`, // a checker
        },
        credentials: "include", // a checker
        body: JSON.stringify({  //a checker
            name: name,
            type: type,
            token: token,
            password: password
        }),
    });

    let responseData: any;

    if (response.headers.get("content-type")?.includes("application/json")) {
        responseData = await response.json();

        if (!response.ok) { //gere tes erreur ici
            if (response.status === 400)
                throw new Error(responseData.message);
            throw new Error(
                `HTTP error! Status: ${response.status}, Message: ${responseData.message}`
            );
        }
        console.log("Channel Created");
        return responseData;
    }
};