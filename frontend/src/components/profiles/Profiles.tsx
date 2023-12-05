import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
import { useState } from "react";
import Modal from "../modal/Modal";
import useProfiles from "../../hooks/useProfiles";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import SyncIcon from "@mui/icons-material/Sync";
import useCodecs from "../../hooks/useCodecs";

const Profiles = () => {
	const profiles: any = useProfiles();
	const [modalType, setModalType] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState<any>({});
	const handleProfileClick = (profile: any) => {
		setSelectedProfile(profile);
		setContent({
			id: profile?.id,
			name: profile?.name,
			codec: profile?.codec,
			codecs: [],
			speed: profile?.speed,
		});
		setModalType("profile");
		setIsModalOpen(true);
	};
	const codecs = useCodecs();
	const onModalSave = async () => {
		await fetch(`http://localhost:8000/api/profiles/${content.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(content),
		});
		setIsModalOpen(false);
		console.log(content);
	};
	console.log(profiles);
	const [content, setContent] = useState({
		id: String,
		name: selectedProfile?.name,
		codec: selectedProfile?.codec,
		codecs: [],
		speed: selectedProfile?.speeds,
	});
	const leftToolBarItems: any = [
		<ToolBarItem text="Advanced" icon={<SyncIcon fontSize="large" />} />,
	];
	const profilesArray: any = [];

	for (let i in profiles) {
		profilesArray.push(profiles[i]);
	}
	console.log(profiles);
	const dummy = (dummy: any) => {};

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
							setShouldSubscribe={dummy}
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
