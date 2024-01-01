import { useEffect, useState } from "react";
import styles from "./OldModal.module.scss";
const Modal = ({ isOpen, onClose, children, profile }: any) => {
	const [codecs, setCodecs] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8000/api/codecs")
			.then((response) => response.json())
			.then((data) => setCodecs(data))
			.catch((error) => console.error(error));
	}, []);
	if (!isOpen) return null;

	const onCodecClick = async (profile: any, codec: string) => {
		if (profile.codecs.includes(codec)) {
			profile.codecs = profile.codecs.filter((c: any) => c !== codec);
		} else {
			profile.codecs.push(codec);
		}
	};

	const onSaveProfile = async () => {
		await fetch("");
		onClose();
	};

	const onCancel = () => {
		onClose();
	};

	const onDeleteProfile = () => {};

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<div className={styles.header}>
					Edit Codec Profile
					<button className="close-button" onClick={onClose}>
						Close
					</button>
				</div>
				<div className={styles.content}>
					<div className={styles.left}>
						<h2>Name: {profile?.name}</h2>
					</div>
					<div className={styles.right}>
						<h3>Codecs</h3>
						<div className={styles.codecs}>
							{codecs.map((codec: string) => (
								<div className={styles.codec}>
									{codec}

									<div
										className={styles.selected}
										onClick={() => onCodecClick(profile, codec)}
										style={
											profile?.codecs?.includes(codec)
												? { backgroundColor: "black" }
												: {}
										}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className={styles.footer}>
					<div className={styles.left}>
						<div className={styles.delete}>Delete</div>
					</div>
					<div className={styles.right}>
						<div className={styles.cancel} onClick={() => onCancel()}>
							Cancel
						</div>
						<div className={styles.save} onClick={() => onSaveProfile()}>
							Save
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Modal;
