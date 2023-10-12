import { useEffect, useState } from 'react'; // n'oubliez pas d'importer useEffect et useState
import  jwt_decode, { JwtPayload }  from 'jwt-decode'; // Assurez-vous que jwt_decode est importé si nécessaire

/**
 * useEffect pour récupérer les données du joueur par pseudo.
 * @function
 * @name useFetchPlayerByPseudo
 * @example
 * useEffect(() => {
 *   getFetchPlayerByPseudo();
 * }, []);
 * @throws {Error} Lancer une erreur si la réponse n'est pas OK.
 */
useEffect(() => {
  /**
   * Fonction asynchrone pour faire une requête GET pour récupérer les données du joueur par pseudo à partir du serveur.
   * @async
   * @function
   * @name getFetchPlayerByPseudo
   * @param {string} pseudo - Le pseudo du joueur à rechercher.
   * @example
   * const playerData = await getFetchPlayerByPseudo('player123');
   * @throws {Error} Lancer une erreur avec le message d'erreur du serveur si la réponse n'est pas OK.
   * @returns {void} Ne renvoie rien.
   */
  const getFetchPlayerByPseudo = async () => {
    try {
      const pseudo = "engoo"
      const response = await fetch(`http://localhost:3000/players/${pseudo}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      
      const playerData = await response.json();
      console.log("DEBUG ::::: ", playerData);
      
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur par pseudo:', error);
    }
  };
  
  // Invocation de la fonction asynchrone définie
  getFetchPlayerByPseudo(); // Remplacez 'player123' par le pseudo réel du joueur à rechercher
}, []);


