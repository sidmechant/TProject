import React, { useState } from 'react';
import styled from 'styled-components';
import { CreateChannelApi } from './Fetch/ChannelFetch';
import { Server as SocketIOServer } from 'socket.io';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
`;

const Input = styled.input`
  margin: 10px 0;
`;

const Select = styled.select`
  margin: 10px 0;
`;

// const CreateChannel: React.FC = () => {
//     const [formData, setFormData] = useState({
//         name: '',
//         type: 'public',
//         password: ''
//     });

//     const [errorResponse, setError] = useState('');

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: name === 'token' ? parseInt(value) : value
//         });
//     };
//     //////////////////////////////
//     const handleSubmit = async () => {
//         try {
//             const responseData = await CreateChannelApi(formData.name, formData.type, formData.password);
//             console.log("Réponse du serveur : ", responseData);
//         } catch (error) {
//             if (error instanceof Error)
//                 setError("error: " + error.message);
//             console.error("Erreur lors de la création du canal : ", error);
//         }
//     };
// //////////////////////////
//     return (
//         <Container>
//             <Input
//                 type="text"
//                 name="name"
//                 placeholder="Nom"
//                 value={formData.name}
//                 onChange={handleChange}
//             />
//             <Select name="type" value={formData.type} onChange={handleChange}>
//                 <option value="public">Public</option>
//                 <option value="private">Private</option>
//                 <option value="protected">Protected</option>
//             </Select>
//             {formData.type === 'protected' && (
//                 <Input
//                     type="password"
//                     name="password"
//                     placeholder="Mot de passe"
//                     value={formData.password}
//                     onChange={handleChange}
//                 />
//             )}
//             <button onClick={handleSubmit}>Envoyer</button>
//             {errorResponse && <p  style={{ color: 'red' }}>{errorResponse}</p>}
//         </Container>
//     );
// };

// export default CreateChannel;


 const CreateChannel = ({ chatSocket }: { chatSocket: Socket<DefaultEventsMap, DefaultEventsMap> | null })=> {
    const [channelName, setChannelName] = useState('');
    const [channelType, setChannelType] = useState('public');
    const [password, setPassword] = useState('');

    const createChannel = () => {
        if (chatSocket) {
            const channelData = {
                name: channelName,
                type: channelType,
                password: password, // Envoyez le mot de passe uniquement si le type est 'protected'
            };
            chatSocket.emit('create-channel', channelData);
        }
    };

    return (
        <div>
            <input value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Channel Name" />
            <select value={channelType} onChange={(e) => setChannelType(e.target.value)}>
                <option value="public">Public</option>
                <option value="protected">Protected</option>
                <option value="private">Private</option>
            </select>
            {channelType === 'protected' && (
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            )}
            <button onClick={createChannel}>Create Channel</button>
        </div>
    );
};

export default CreateChannel;