import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
import { useContext, useState } from "react";
import ProfileModal from "../profileModal/ProfileModal";
import { WebSocketContext } from "../../contexts/webSocketContext";

const Profiles = () => {
	const wsContext = useContext(WebSocketContext);
	const profiles = wsContext?.data?.profiles;
	const [modalType, setModalType] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState<any>({});
	const handleProfileClick = (profile: any) => {
		setSelectedProfile(profile);
		setContent({
			id: profile?.id,
			name: profile?.name,
			codec: profile?.codec,
			codecs: profile?.codecs || [],
			speed: profile?.speed,
			container: profile?.container,
			encoder: profile?.encoder,
			extension: profile?.extension,
		});
		setModalType("profile");
		setIsModalOpen(true);
	};

	const onModalDelete = async () => {
		await fetch(
			`http://${window.location.hostname}:8000/api/profiles/${selectedProfile?.id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		setIsModalOpen(false);
	};

	const onModalSave = async () => {
		await fetch(`http://${window.location.hostname}:8000/api/profiles`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(content),
		});
		setIsModalOpen(false);
	};
	const [content, setContent] = useState({
		id: String,
		name: selectedProfile?.name,
		codec: selectedProfile?.codec,
		codecs: selectedProfile.codecs || [],
		speed: selectedProfile?.speed,
		container: selectedProfile?.container,
		extension: selectedProfile?.extension,
		encoder: selectedProfile?.encoder,
	});
	const profilesArray: any = [];

	for (const i in profiles) {
		profilesArray.push(profiles[i]);
	}

	return (
		<div className={styles.profiles}>
			{isModalOpen && modalType === "profile" && (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<ProfileModal
							header={"Edit - Codec Profile"}
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
							<div onClick={() => handleProfileClick(profile)}>
								<Profile name={profile?.name} codecs={profile?.codecs} />
							</div>
						))}
						<div onClick={() => handleProfileClick({})}>
							<Profile type={"add"} name={""} codecs={[]} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Profiles;
