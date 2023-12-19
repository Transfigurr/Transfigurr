import styles from "./Profiles.module.scss";
import Profile from "../profile/Profile";
import { useState } from "react";
import Modal from "../modal/Modal";
import useProfiles from "../../hooks/useProfiles";
import ToolBar from "../ToolBar/ToolBar";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import SyncIcon from "@mui/icons-material/Sync";
import useCodecs from "../../hooks/useCodecs";
import useContainers from "../../hooks/useContainers";
import useEncoders from "../../hooks/useEncoders";
import ProfileModal from "../profileModal/ProfileModal";

const Profiles = () => {
	const profiles: any = useProfiles();
	const [modalType, setModalType] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProfile, setSelectedProfile] = useState<any>({});
	const containers = useContainers();
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
	const codecs = useCodecs();

	const onModalDelete = async () => {
		await fetch(`http://localhost:8000/api/profiles/${selectedProfile?.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		setIsModalOpen(false);
		console.log(content);
	};

	const onModalSave = async () => {
		await fetch(`http://localhost:8000/api/profiles`, {
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
		codecs: selectedProfile.codecs || [],
		speed: selectedProfile?.speed,
		container: selectedProfile?.container,
		extension: selectedProfile?.extension,
		encoder: selectedProfile?.encoder,
	});
	const profilesArray: any = [];

	for (let i in profiles) {
		profilesArray.push(profiles[i]);
	}
	console.log(profiles);
	const dummy = (dummy: any) => {};

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
