import React, { useState, useRef, useEffect } from "react";
import styles from "./GroupedAutocomplete.module.scss";

interface GroupedAutocompleteProps {
	data: Array<{
		id: string;
		name: string;
		children?: Array<{
			id: string;
			name: string;
		}>;
	}>;
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

const GroupedAutocomplete: React.FC<GroupedAutocompleteProps> = ({
	data,
	value = "",
	onChange,
	placeholder = "Search...",
	disabled = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState(value);
	const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
		new Set(data.map(group => group.id)) // Start with all child groups collapsed
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Update searchTerm when value prop changes
	useEffect(() => {
		setSearchTerm(value);
	}, [value]);

	const toggleSection = (sectionId: string) => {
		setCollapsedSections(prev => {
			const newSet = new Set(prev);
			if (newSet.has(sectionId)) {
				newSet.delete(sectionId);
			} else {
				newSet.add(sectionId);
			}
			return newSet;
		});
	};

	const handleItemSelect = (itemId: string, itemName: string) => {
		if (onChange) {
			onChange(itemId);
		}
		setSearchTerm(itemName);
		setIsOpen(false);
	};

	const filteredData = data.map(group => ({
		...group,
		children: group.children?.filter(child =>
			child.name.toLowerCase().includes(searchTerm.toLowerCase())
		) || []
	})).filter(group => 
		group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		(group.children && group.children.length > 0)
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
		setIsOpen(true);
	};

	const handleInputFocus = () => {
		setIsOpen(true);
	};

	return (
		<div className={styles.groupedAutocomplete} ref={dropdownRef}>
			<input
				ref={inputRef}
				type="text"
				value={searchTerm}
				onChange={handleInputChange}
				onFocus={handleInputFocus}
				placeholder={placeholder}
				disabled={disabled}
				className={styles.input}
			/>
			
			{isOpen && (
				<div className={styles.dropdown}>
					{filteredData.length === 0 ? (
						<div className={styles.noResults}>No results found</div>
					) : (
						filteredData.map(group => (
							<div key={group.id} className={styles.group}>
								<div
									className={styles.groupHeader}
									onClick={() => toggleSection(group.id)}
								>
									<span className={styles.groupName}>{group.name}</span>
									<span className={styles.toggleIcon}>
										{collapsedSections.has(group.id) ? "▶" : "▼"}
									</span>
								</div>
								
								{!collapsedSections.has(group.id) && group.children && (
									<div className={styles.groupChildren}>
										{group.children.map(child => (
											<div
												key={child.id}
												className={styles.childItem}
												onClick={() => handleItemSelect(child.id, child.name)}
											>
												{child.name}
											</div>
										))}
									</div>
								)}
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default GroupedAutocomplete;