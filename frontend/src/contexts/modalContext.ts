import { createContext } from "react";

export type ModalContextType = {
	modalType: object;
	setModalType: React.Dispatch<React.SetStateAction<string>>;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	modalData: object;
	setModalData: React.Dispatch<React.SetStateAction<any>>;
};

export const ModalContext = createContext<ModalContextType | undefined>(
	undefined,
);
