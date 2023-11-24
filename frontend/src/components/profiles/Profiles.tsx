import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
import { useState } from "react";
import Modal from "../modal/Modal";
import useProfiles from "../../hooks/useProfiles";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import SyncIcon from "@mui/icons-material/Sync";

const Profiles = () => {
	const profiles = useProfiles();
	const [modalType, setModalType] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState<any>({});
	const handleProfileClick = (profile: any) => {
		setSelectedProfile(profile);
		setContent({
			id: profile?.id,
			name: profile?.name,
			codec: profile?.codec,
			codecs: profile?.codecs,
			speed: profile?.speed,
		});
		setModalType("profile");
		setIsModalOpen(true);
	};
	const onModalSave = async () => {
		await fetch(`http://localhost:8000/api/profiles/${content.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ profile: content }),
		});
	};

	const [content, setContent] = useState({
		id: selectedProfile?.id,
		name: selectedProfile?.name,
		codec: selectedProfile?.codec,
		codecs: selectedProfile?.codecs,
		speed: selectedProfile?.speeds,
	});
	const leftToolBarItems: any = [
		<ToolBarItem text="Advanced" icon={<SyncIcon fontSize="large" />} />,
	];

	const profilesArray: [] = [];

	for (let i in profiles) {
		profilesArray.push(profiles[i]);
	}

	return (
		<div className={styles.profiles}>
			<ToolBar leftToolBarItems={leftToolBarItems} />
			{isModalOpen && modalType === "profile" && (
				<div className={styles.modalBackdrop}>
					<div className={styles.modalContent}>
						<Modal
							header={"Edit - Codec Profile"}
							type={"profile"}
							isOpen={isModalOpen}
							setIsOpen={setIsModalOpen}
							onSave={onModalSave}
							data={selectedProfile}
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			)}
			<div className={styles.content}>
				<div className={styles.codecProfiles}>
					<div className={styles.header}>Codec Profiles</div>
					<div className={styles.profileContainer}>
						{profilesArray?.map((profile: any) => (
							<div onClick={() => handleProfileClick(profile)}>
								<Profile name={profile?.name} codecs={profile?.codecs} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Profiles;
