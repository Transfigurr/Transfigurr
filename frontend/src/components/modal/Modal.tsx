import { useContext, useEffect } from "react";
import SeriesModals from "../seriesModals/SeriesModals";
import ProfileModal from "../profileModal/ProfileModal";
import { ModalContext } from "../../contexts/modalContext";
const Modal = () => {
	const modalContext = useContext(ModalContext);
	const type = modalContext?.modalType;

	if (type === "editSeries") {
		return <SeriesModals />;
	} else {
		return <ProfileModal />;
	}
};
export default Modal;
