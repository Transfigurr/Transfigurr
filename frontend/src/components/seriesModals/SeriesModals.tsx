import useProfilesAPI from "../../hooks/useProfilesAPI";
import styles from "./SeriesModals.module.scss";
import InputSelect from "../inputSelect/InputSelect";
import InputCheckbox from "../inputCheckbox/InputCheckbox";
import { useEffect } from "react";

const SeriesModal = ({ setIsModalOpen, content, setContent }: any) => {
	const profiles: object = useProfilesAPI();

	const onClose = () => {
		setIsModalOpen(false);
	};

	const onSave = async () => {
		await fetch(
			`http://${window.location.hostname}:7889/api/series/${content.name}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify(content),
			},
		);
		setIsModalOpen(false);
	};

	useEffect(() => {
		const modalBackdropClass = "modalBackdrop";

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsModalOpen(false);
			}
		};
		const handleOutsideClick = (event: any) => {
			if (event.target.classList.value.includes(modalBackdropClass)) {
				setIsModalOpen(false);
			}
		};
		window.addEventListener("click", handleOutsideClick);
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [setIsModalOpen]);

	return (
		<div className={styles.modal}>
			<div className={styles.header}>
				<div className={styles.left}>{content?.name}</div>
				<div className={styles.right}>
					<div className={styles.cross} onClick={onClose}>
						<div className={styles.verticalCross}></div>
						<div className={styles.horizontalCross}></div>
					</div>
				</div>
			</div>
			<div className={styles.content}>
				<div className={styles.inputContainer}>
					<label className={styles.label}>Monitored </label>
					<InputCheckbox
						type="checkbox"
						checked={content?.monitored}
						onChange={(e: any) =>
							setContent({
								...content,
								monitored: e.target.checked,
							})
						}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label className={styles.label}>Profile </label>
					<InputSelect
						selected={content.profile_id}
						onChange={(e: any) => {
							setContent({ ...content, profile_id: e.target.value });
						}}
					>
						{Object.values(profiles)?.map((profile: any, index: number) => (
							<option value={profile.id} key={index}>
								{profile.name}
							</option>
						))}
					</InputSelect>
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
