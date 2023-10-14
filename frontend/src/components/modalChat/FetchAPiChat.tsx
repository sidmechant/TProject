import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000'; // Base URL
axios.defaults.withCredentials = true; // Permet d'envoyer les credentials (comme les cookies) lors de chaque requête


class ExtendedError extends Error {
  statusCode?: number;
}

/**
* Vérifie et gère les erreurs de la réponse axios.
* @param {any} error - L'erreur retournée par axios.
* @returns {void} - Lance une erreur adaptée.
*/
const handleAxiosError = (error: any) => {
  const err = new ExtendedError();
  err.statusCode = error.response ? error.response.status : 500;
  err.message = error.message;

  // Essayons de parser le message d'erreur
  try {
      const parsedMessage = error.response.data;
      if (parsedMessage.statusCode === 428) {
          err.statusCode = 428;
          err.message = parsedMessage.error;
      }
  } catch (e) {
      // Si le parsing échoue, on ne fait rien et on conserve le comportement par défaut
  }

  console.error("Error", error);
  throw err;
}

const sendFriendRequest = async (receiverPseudo : any) => {
    try {
        const response = await axios.post('/friends/friend-request', { receiverPseudo });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

const acceptFriendRequest = async (requesterId : any) => {
    try {
      const response = await axios.patch('/friends/friend-request/accept', { requesterId });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
  
  const declineFriendRequest = async (requesterId : any) => {
    try {
      const response = await axios.patch('/friends/friend-request/decline', { requesterId });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  const deleteFriend = async (requesterId : any) => {
    try {

    } catch (error) {
      handleAxiosError(error);
    }
  }
  
  const searchPseudo = async (pseudo : any) => {
    try {
      const response = await axios.get(`/friends/search-pseudo?pseudo=${pseudo}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
  
  const getFriends = async () => {
    try {
      const response = await axios.get('/friends/friends');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  export const getMyself = () => {
    const myself = JSON.parse(localStorage.getItem('player') as string);
    return myself;
  }
  
  const getUsersOnline = async () => {
    try {
      const response = await axios.get('/friends/users-online');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
  
  const getFriendsOnline = async () => {
    try {
      const response = await axios.get('/friends/friends-online');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  export const fetcher = async (route: string) => {
    try {
      const response = await axios.get(route);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }

  }

  const getDataByPseudoApi = async (pseudo: string) => {
    try {
        const response = await axios.get(`/players/${pseudo}`, {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
  }

  const getFriendlist = async () => {
    try {
      const response = await axios.get('/friends/friendlist');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
  const getPendingFriends = async () => {
      try {
          const response = await axios.get('/friends/pending');
          return response.data;
      } catch (error) {
          handleAxiosError(error);
      }
  }
  
  const getAcceptedFriends = async () => {
      try {
          const response = await axios.get('/friends/accepted');
          return response.data;
      } catch (error) {
          handleAxiosError(error);
      }
  }

  const getBlockedUsers = async () => {
    try {
        const response = await axios.get('/friends/blocked');
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
  }

  export async function createChannel(channelData: any, jwtToken: string | null, sessionToken: string | null) {
    const ENDPOINT_URL: string = 'channels/created';
    
    if (!channelData || !jwtToken)
        throw new Error("Missing required parameters.");

    const headers: any = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    if (sessionToken)
        headers['Session-Token'] = sessionToken;

    try {
      console.log('trying to create channel');
        const response: any = await axios.post(ENDPOINT_URL, channelData, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        //console.error("Failed to create channel:", error.response?.data?.message || error.message);
        //throw new Error(error.response?.data?.message || "Failed to create channel.");
        handleAxiosError(error);
    }
}

  export const joinChannel = async () => {
    try {
      const response = await axios.get('/channel/add-member-channel');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  export const getChannels = async () => {
    try {
      const response = await axios.get('/channels/allChannel');
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  export const getMissingChannels = async (userId: number) => {
    try {
      const response = await axios.get(`/channels/missingChannels/${userId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  export const getMyChannels = async (userId: number) => {
    try {
      const response = await axios.get(`/channels/${userId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }
  
  export {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    searchPseudo,
    getFriends,
    getUsersOnline,
    getFriendsOnline,
    getDataByPseudoApi,
    getAcceptedFriends,
    getPendingFriends,
    getBlockedUsers,
    getFriendlist,
    deleteFriend,
  };