import InputContainer from "../../inputs/inputContainer/InputContainer";
import Modal from "../../modal/Modal";

const HistoryModal = ({ isOpen, setIsOpen, content, setContent }: any) => {
	const onSave = async () => {
		for (const key in content) {
			fetch(`http://${window.location.hostname}:7889/api/settings`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: JSON.stringify({ id: key, value: content[key] }),
			});
		}
		setIsOpen(false);
	};
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
