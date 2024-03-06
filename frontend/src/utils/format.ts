export const formatDate = (date: string) => {
	const dateObject = new Date(date);
	const today = new Date();
	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	if (dateObject.toDateString() === today.toDateString()) {
		return dateObject.toLocaleString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	} else if (dateObject.toDateString() === yesterday.toDateString()) {
		return "Yesterday";
	} else {
		return (
			dateObject.toLocaleString("en-US", {
				month: "short",
			}) +
			" " +
			dateObject.getDate() +
			" " +
			dateObject.getFullYear()
		);
	}
};

export const formatSize = (size: number) => {
	let sizeString = "";
	const isNegative = size < 0;
	size = Math.abs(size);

	if (size < 1024) {
		sizeString = `${size} Bytes`;
	} else if (size < 1024 * 1024) {
		sizeString = `${(size / 1024).toFixed(2)} KB`;
	} else if (size < 1024 * 1024 * 1024) {
		sizeString = `${(size / (1024 * 1024)).toFixed(2)} MB`;
	} else if (size < 1024 * 1024 * 1024 * 1024) {
		sizeString = `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	} else {
		sizeString = `${(size / (1024 * 1024 * 1024 * 1024)).toFixed(2)} TB`;
	}

	return isNegative ? `-${sizeString}` : sizeString;
};
