import styles from "./ProfileModal.module.scss";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../contexts/webSocketContext";
import ProfileEditor from "../profileEditor/ProfileEditor";

const ProfileModal = ({
	isOpen,
	setIsOpen,
	header,
	onSave,
	onDelete,
	content,
	setContent,
}: any) => {
	const wsContext = useContext(WebSocketContext);
	const codecs: any = wsContext?.data?.codecs;
	const containers: any = wsContext?.data?.containers;
	const encoders: any = wsContext?.data?.encoders;
	const settings = wsContext?.data?.settings;
	const [tabSelected, setTabSelected] = useState("summary");
	const onClose = () => {
		setIsOpen(false);
	};
	useEffect(() => {
		const modalBackdropClass = "modalBackdrop";

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};
		const handleOutsideClick = (event: any) => {
			if (event.target.classList.value.includes(modalBackdropClass)) {
				setIsOpen(false);
			}
		};
		window.addEventListener("click", handleOutsideClick);
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [setIsOpen]);

	if (!isOpen) return null;
	return (
		<div className={styles.modal}>
			<div className={styles.header}>
				<div className={styles.left}>
					{header} {content?.name}
				</div>
				<div className={styles.right}>
					<div className={styles.cross} onClick={onClose}>
						<div className={styles.verticalCross} />
						<div className={styles.horizontalCross} />
					</div>
				</div>
			</div>
			<ProfileEditor
				content={content}
				setContent={setContent}
				tabSelected={tabSelected}
				setTabSelected={setTabSelected}
				containers={containers}
				encoders={encoders}
				codecs={codecs}
			/>
			<div className={styles.footer}>
				<div className={styles.left}>
					{settings?.default_profile != content?.id && (
						<div className={styles.delete} onClick={onDelete}>
							Delete
						</div>
					)}
				</div>
				<div className={styles.right}>
					<div className={styles.cancel} onClick={onClose}>
						Cancel
					</div>
					<div className={styles.save} onClick={() => onSave()}>
						Save
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProfileModal;
