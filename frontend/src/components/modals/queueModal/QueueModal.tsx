import InputContainer from "../../inputs/inputContainer/InputContainer";
import Modal from "../../modal/Modal";

const QueueModal = ({
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
			title={"Queue Options"}
			onClose={onClose}
		>
			<InputContainer
				label="Page Size"
				type="text"
				selected={content.queue_page_size}
				onChange={(e: any) => {
					setContent({
						...content,
						queue_page_size: e.target.value,
					});
				}}
			/>
		</Modal>
	);
};
export default QueueModal;
