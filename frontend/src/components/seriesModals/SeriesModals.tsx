import { useEffect } from "react";
import useProfilesAPI from "../../hooks/useProfilesAPI";
import styles from "./SeriesModals.module.scss";

const SeriesModal = ({
	isOpen,
	setIsOpen,
	header,
	onSave,
	content,
	setContent,
}: any) => {
	const profiles: {} = useProfilesAPI();

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
				<div className={styles.left}>{header}</div>
				<div className={styles.right}>
					<div className={styles.cross} onClick={onClose}>
						<div className={styles.verticalCross}></div>
						<div className={styles.horizontalCross}></div>
					</div>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.inputContainer}>
					<label>Monitored </label>
					<input
						type="checkbox"
						checked={content.monitored}
						onChange={(e) =>
							setContent({ ...content, monitored: e.target.checked })
						}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label>Profile </label>
					<select
						className={styles.select}
						value={content.profile_id}
						onChange={(e) => {
							setContent({ ...content, profile_id: e.target.value });
						}}
					>
						{Object.values(profiles)?.map((profile: any) => (
							<option value={profile.id}>{profile.name}</option>
						))}
					</select>
				</div>
			</div>
			<div className={styles.footer}>
				<div className={styles.left}></div>
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
export default SeriesModal;
