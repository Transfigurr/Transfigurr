import { useContext } from "react";
import useProfilesAPI from "../../hooks/useProfilesAPI";
import styles from "./SeriesModals.module.scss";
import { ModalContext } from "../../contexts/modalContext";

const SeriesModal = () => {
	const profiles: object = useProfilesAPI();

	const modalContext = useContext(ModalContext);
	const onClose = () => {
		modalContext?.setShowModal(false);
	};

	const { setShowModal, modalData, setModalData }: any = modalContext || {};

	const onSave = async () => {
		await fetch(`http://localhost:8000/api/series/${modalData.name}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(modalData),
		});
		setShowModal(false);
	};

	return (
		<div className={styles.modal}>
			<div className={styles.header}>
				<div className={styles.left}>{modalData?.name}</div>
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
						checked={modalData?.monitored}
						onChange={(e) =>
							setModalData({
								...modalData,
								monitored: e.target.checked,
							})
						}
					/>
				</div>
				<div className={styles.inputContainer}>
					<label>Profile </label>
					<select
						className={styles.select}
						value={modalData.profile_id}
						onChange={(e) => {
							setModalData({ ...modalData, profile_id: e.target.value });
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
