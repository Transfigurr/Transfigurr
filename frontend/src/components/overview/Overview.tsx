import styles from "./Overview.module.scss";
const Overview = ({ series }: any) => {
	return <div className={styles.overview}>{series?.id}</div>;
};
export default Overview;
