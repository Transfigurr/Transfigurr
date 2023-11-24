import { useEffect, useState } from "react";
import styles from "./Poster.module.scss";

const PosterComponent = ({ id, data }: any) => {
	const status = "Monitored";
	const profile = "AV1";
	const progress = "80%";

	const [imageList, setImageList] = useState([]);
	useEffect(() => {
		// Fetch the list of image URLs from the FastAPI backend
		fetch("http://localhost:8000/api/image_collection")
			.then((response) => response.json())
			.then((data) => setImageList(data.image_files))
			.catch((error) => console.error("Error fetching image list:", error));
	}, []);

	console.log(data);
	return (
		<div className={styles.cardArea}>
			<div className={styles.card}>
				<div className={styles.cardContent}>
					{
						//<div className={styles.ended}></div>
					}
					{}

					<img
						className={styles.img}
						src={
							"http://localhost:8000/config/metadata/series/" +
							data.name +
							"/poster.jpg"
						}
						alt={data.name}
					></img>
					<div className={styles.footer}>
						<div className={styles.progressBar}>
							<div
								className={styles.progress}
								style={{ width: progress }}
							></div>
						</div>
						<div className={styles.status}>{status}</div>
						<div className={styles.profile}>{profile}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PosterComponent;
