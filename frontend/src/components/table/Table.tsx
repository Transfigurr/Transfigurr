import styles from "./Table.module.scss";
import SkipNext from "../svgs/skip_next.svg?react";
import SkipPrevious from "../svgs/skip_previous.svg?react";
import NavigateNext from "../svgs/navigate_next.svg?react";
import NavigateBefore from "../svgs/navigate_before.svg?react";
const Table = ({
	children,
	showPagination = false,
	firstPage,
	currentPage,
	prevPage,
	totalPages,
	totalRecords = 0,
	lastPage,
	nextPage,
}: any) => {
	return (
		<>
			<table className={styles.table}>{children}</table>
			{showPagination && (
				<>
					<div className={styles.navigation}>
						<div
							onClick={firstPage}
							className={currentPage === 1 ? styles.disabled : styles.button}
						>
							<SkipPrevious className={styles.svg} />
						</div>
						<div
							onClick={prevPage}
							className={currentPage === 1 ? styles.disabled : styles.button}
						>
							<NavigateBefore className={styles.svg} />
						</div>
						<div className={styles.pageInfo}>
							{currentPage} / {totalPages}
						</div>
						<div
							onClick={nextPage}
							className={
								currentPage === totalPages ? styles.disabled : styles.button
							}
						>
							<NavigateNext className={styles.svg} />
						</div>
						<div
							onClick={lastPage}
							className={
								currentPage === totalPages ? styles.disabled : styles.button
							}
						>
							<SkipNext className={styles.svg} />
						</div>
					</div>
					<div className={styles.totalRecords}>
						Total Records: {totalRecords}
					</div>
				</>
			)}
		</>
	);
};
export default Table;
