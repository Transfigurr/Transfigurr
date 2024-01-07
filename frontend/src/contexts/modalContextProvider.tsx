// ModalProvider.tsx
import React, { useState } from "react";
import { ModalContext, ModalContextType } from "./modalContext";

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [modalData, setModalData] = useState({}); // replace {} with your initial modal state
	const [modalType, setModalType] = useState("");

	const modalContextValue: ModalContextType = {
		showModal,
		setShowModal,
		modalType,
		setModalType,
		modalData,
		setModalData,
	};

	return (
		<ModalContext.Provider value={modalContextValue}>
			{children}
		</ModalContext.Provider>
	);
};

export default ModalProvider;
