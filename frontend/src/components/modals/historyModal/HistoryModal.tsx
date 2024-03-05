import InputContainer from "../../inputs/inputContainer/InputContainer";
import Modal from "../../modal/Modal";

const HistoryModal = ({
	isOpen,
	setIsOpen,
	onSave,
	content,
	setContent,
}: any) => {
	const onClose = () => {
		setIsOpen(false);
	};
	if (!isOpen) return null;
	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			onSave={onSave}
			title={"History Options"}
			onClose={onClose}
		>
			<InputContainer
				label="Page Size"
				type="text"
				selected={content.history_page_size}
				onChange={(e: any) => {
					setContent({
						...content,
						history_page_size: e.target.value,
					});
				}}
			/>
		</Modal>
	);
};
export default HistoryModal;
