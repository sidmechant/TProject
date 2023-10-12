
import React, { useState } from 'react';
import styled from 'styled-components';
import jwt_decode from 'jwt-decode';
import axios from 'axios'

interface DecodedToken {
	sub: string;
}

const Grid = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;

const InputField = styled.input`
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  width: 300px;
  height: 40px;
  border-radius: 4px;
`;

const TwoFABtn = styled.button`
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  width: 300px;
  height: 40px;
  border-radius: 4px;
  font-size: 20px;
`;

const About = () => {
	const [code, setCode] = useState<string | undefined>(undefined);
	const [inputCode, setInputCode] = useState<string>('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputCode(e.target.value);
	};
	const verifyCode = async (code: string) => {
		console.log("Code to verify: ", code);
		try {
			const response = await axios.post(
				'http://localhost:3000/2fa/turn-on',
				JSON.stringify({ twoFactorAuthenticationCode: code }),
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true, // Only sending credentials, no bearer token
				}
			);
			if (response.data.isSuccess) {
				console.log(response.data.message);
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error('There was a problem with the request:', error);
		}
		console.log("Code to verify: ", inputCode);
	};

	const disable2fa = async () => {
		try {
			// Disable the two-factor authentication for the user
			const response = await axios.patch(
				'http://localhost:3000/2fa/users',
				{},
				{
					headers: {
						'Content-Type': 'application/json',

					},
					withCredentials: true,
				}
			);

			if (response.data.statusCode === 200) {
				console.log(response.data.message);
			} else {
				console.error(response.data.message);
			}
		} catch (error) {
			console.error('There was a problem with the request:', error);
		}

	};

	const handleClick = async () => {
		try {

			const token = document.cookie.split('; ').find(row => row.startsWith('jwt_token='))?.split('=')[1];

			if (!token) throw new Error('Token is not available');

			const decodedToken = jwt_decode(token) as DecodedToken;
			const userId = decodedToken.sub;
			await axios.post('http://localhost:3000/2fa/generate',
				JSON.stringify({ id: userId }), // Corps de la requête
				{
					headers: {
						'Content-Type': 'application/json', // Assurez-vous de définir le bon type de contenu
					},
					withCredentials: true, // Pour inclure les cookies dans la requête
				}
			).then(response => {
				setCode(response.data.qrCodeDataUrl);
				console.log("REs ==== " + response.data.qrCodeDataUrl); // Utilisez response.data pour accéder au corps de la réponse
			});

		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	}


	return (
		<Grid>
			<TwoFABtn onClick={handleClick}>
				2FA
			</TwoFABtn>
			{code &&
				<>
					<img src={code} alt="qrcode" />
					<InputField
						type="text"
						value={inputCode}
						onChange={handleInputChange}
						placeholder="Enter your 2FA code"
					/>
					<TwoFABtn onClick={() => verifyCode(inputCode)}>Verify Code</TwoFABtn>


				</>}
		</Grid>
	);
};

export default About;
