import styles from "./Table.module.scss";
import { ReactComponent as SkipNext } from "../svgs/skip_next.svg";
import { ReactComponent as SkipPrevious } from "../svgs/skip_previous.svg";
import { ReactComponent as NavigateNext } from "../svgs/navigate_next.svg";
import { ReactComponent as NavigateBefore } from "../svgs/navigate_before.svg";
const Table = ({
	children,
	showPagination = false,
	firstPage,
	currentPage,
	prevPage,
	totalPages,
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
							<SkipPrevious />
						</div>
						<div
							onClick={prevPage}
							className={currentPage === 1 ? styles.disabled : styles.button}
						>
							<NavigateBefore />
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
							<NavigateNext />
						</div>
						<div
							onClick={lastPage}
							className={
								currentPage === totalPages ? styles.disabled : styles.button
							}
						>
							<SkipNext />
						</div>
					</div>
					<div className={styles.totalRecords}>Total Records: {totalPages}</div>
				</>
			)}
		</>
	);
};
export default Table;
