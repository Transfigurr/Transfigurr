import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
import { useContext, useState } from "react";
import ProfileModal from "../profileModal/ProfileModal";
import { WebSocketContext } from "../../contexts/webSocketContext";

const Profiles = () => {
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const [selectedProfile, setSelectedProfile] = useState<any>({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleProfileClick = (profile: any) => {
		setSelectedProfile(profile);
		setContent(profile);
		setIsModalOpen(true);
	};

	const onModalDelete = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/profiles/${selectedProfile?.id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			},
		);
		setIsModalOpen(false);
	};

	const onModalSave = async () => {
		await fetch(`http://${window.location.hostname}:7889/api/profiles`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
			body: JSON.stringify(content),
		});
		setIsModalOpen(false);
	};
	const [content, setContent] = useState(selectedProfile);
	const profilesArray: any = [];

	for (const i in profiles) {
		profilesArray.push(profiles[i]);
	}

	return (
		<div className={styles.profiles}>
			{isModalOpen && (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<ProfileModal
							header={"Edit - Profile"}
							type={"profile"}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onModalSave}
							onDelete={onModalDelete}
							data={selectedProfile}
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			)}
			<div className={styles.content}>
				<div className={styles.codecProfiles}>
					<div className={styles.header}>Profiles</div>
					<div className={styles.profileContainer}>
						{profilesArray?.map((profile: any) => (
							<Profile
								name={profile?.name}
								key={profile?.name}
								codecs={profile?.codecs}
								onClick={handleProfileClick}
								profile={profile}
							/>
						))}
						<Profile
							type={"add"}
							key={"add"}
							name={""}
							codecs={[]}
							profile={{}}
							onClick={handleProfileClick}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Profiles;
