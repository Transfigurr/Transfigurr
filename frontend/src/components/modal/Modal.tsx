import { useEffect } from "react";
import styles from "./Modal.module.scss";
import SeriesModals from "../seriesModals/SeriesModals";
import ProfileModal from "../profileModal/ProfileModal";
const Modal = ({
	isOpen,
	setIsOpen,
	header,
	type,
	data,
	onSave,
	content,
	setContent,
}: any) => {
	const onClose = () => {
		setIsOpen(false);
	};

	const onDelete = () => {};

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
					<button className="close-button" onClick={onClose}>
						Close
					</button>
				</div>
			</div>
			<div className={styles.content}>
				{type === "edit" ? (
					<SeriesModals
						type={type}
						content={content}
						setContent={setContent}
						data={data}
					/>
				) : (
					<ProfileModal content={content} setContent={setContent} data={data} />
				)}
			</div>
			<div className={styles.footer}>
				<div className={styles.left}>
					<div className={styles.delete} onClick={onDelete}>
						Delete
					</div>
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
export default Modal;
