import { createContext } from "react";

export type ModalContextType = {
	modalType: Object; // or replace with a more specific type
	setModalType: React.Dispatch<React.SetStateAction<string>>;
	showModal: boolean;
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
	modalData: Object;
	setModalData: React.Dispatch<React.SetStateAction<any>>;
};

export const ModalContext = createContext<ModalContextType | undefined>(
	undefined
);
