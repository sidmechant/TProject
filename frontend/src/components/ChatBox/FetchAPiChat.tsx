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
  const err = new ExtendedError(); // <-- Modifiez cette ligne
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


  const getDataByPseudoApi = async (pseudo: string) => {
    try {
        const response = await axios.get(`/players/${pseudo}`, {
            headers: { 'Accept': 'application/json' }
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }


  const getPendingFriends = async () => {
      try {
          const response = await axios.get('/friends/pending');
          return response.data;
      } catch (error) {
          handleAxiosError(error);
      }
  }
  
  // Récupérer la liste des amis acceptés
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
};
  
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
    getBlockedUSers
  };