import { useState, useEffect } from 'react';
import { useUserInfos } from '../components/ContextBoard';
import styled from 'styled-components';
import { getPlayerDataApi } from '../components/Profil/FetchApi';
import UpdateInfo from '../components/Profil/ChangeInfo';
import { TwoFAToggle } from '../components/Profil/TwoFAToggle';
import { WrittingContainer } from '../components/Profil/ProfileStyle';

const ContainerBlock = styled.div`
	width: 310px;
	height: 620px;
	background-color: #955DDE;
	position: absolute;
	z-index:-10;
	clip-path: polygon(0% 0%, 80% 0%, 100% 10%, 100% 100%,  20% 100%, 0% 90%);
`;

const OutlineBlock = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 295px;
	height: 590px;
	outline: 1px solid #000000;
	border-radius: 5px;
	position: relative;
`;


const ProfilTitle = styled.div`
  font-family: 'InknutAntiqua', sans-serif;
  padding-left: 20px;
  padding-right: 20px;
  font-weight: 400;
  color: #ffffff;
  font-size: 30px;
  position: relative;

  &::before,
  &::after,
  & > span::before,
  & > span::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    background: white;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &::before {
	transform: translate(0%, 100%);
    top: 0;
    left: 0;
  }

  &::after {
	transform: translate(0%, 100%);
    top: 0;
    right: 0;
  }

  & > span::before {
	transform: translate(0%, -100%);
    bottom: 0;
    left: 0;
  }

  & > span::after {
	transform: translate(0%, -100%);
    bottom: 0;
    right: 0;
  }
`;

const StyledImage = styled.img`
	width: 150px;
	height: 150px;
	border-radius: 5%;
	object-fit: cover;
	margin-top: 20px;
	margin-bottom: 5px;
`;

const Container = styled.div`
  padding-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;



export default function Profil() {
	const [errorProfile, setErrorProfile] = useState<string | null>(null);
	const { userInfo, setUserInfo, setIsConnected, setNeedToReload } = useUserInfos();
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await getPlayerDataApi();
				setUserInfo({ pseudo: data.player.pseudo, urlPhoto: data.player.urlPhotoProfile });
			} catch (error: any) {
				if (error && (error.statusCode === 401 || error.statusCode === 403)) {
					console.log("ludi regarde t connecteeeeeeeeeeeeeeeeeeeeeeer");
					setIsConnected(false);
					setNeedToReload(true);
				}
				console.error('Erreur lors de la récupération du joueur:', error);
				setErrorProfile('Erreur lors de la récupération du joueur: ' + error as string);
			}
		};
		fetchData();
	}, []);

	return (
		<>
			{errorProfile &&
				<p>{errorProfile}</p>}
			<Container>
				<OutlineBlock>
					{/* Profile Header */}
					<ProfilTitle>
						PROFILE
						<span></span>
					</ProfilTitle>
					{/* Infos Joueurs */}
					{userInfo &&
						<>
							<StyledImage src={userInfo.urlPhoto} alt="Profile picture" />
							<WrittingContainer>{userInfo.pseudo}</WrittingContainer>
							{/* Profile GameHistory */}
							<WrittingContainer $color='#000000' $weight='700' $size='15px'>
								GAME HISTORY
							</WrittingContainer>
							<UpdateInfo name={userInfo.pseudo} onFirstUpdate={false} />
						</>
					}
				</OutlineBlock>
				<ContainerBlock />
				<TwoFAToggle />
			</Container>
		</>
	);
}
