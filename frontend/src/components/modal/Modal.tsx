import styles from "./Modal.module.scss";
import { useEffect } from "react";

const Modal = ({
	isOpen,
	setIsOpen,
	onSave,
	onClose,
	title,
	children,
	showDelete = false,
	onDelete = () => {
		undefined;
	},
}: any) => {
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
		<div className={styles.modalBackdrop}>
			<div className={styles.modalContent}>
				<div className={styles.modal}>
					<div className={styles.header}>
						<div className={styles.left}>{title}</div>
						<div className={styles.right}>
							<div className={styles.cross} onClick={onClose}>
								<div className={styles.verticalCross}></div>
								<div className={styles.horizontalCross}></div>
							</div>
						</div>
					</div>
					{children}
					<div className={styles.footer}>
						<div className={styles.left}>
							{showDelete && (
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
			</div>
		</div>
	);
};
export default Modal;
