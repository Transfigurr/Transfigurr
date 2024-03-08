import InputContainer from "../inputs/inputContainer/InputContainer";
import styles from "./ProfileDimensions.module.scss";
const ProfileDimensions = ({ content, setContent }: any) => {
	return (
		<div className={styles.section}>
			<div className={styles.top}>
				<div className={styles.left}>
					<div className={styles.label}>Orientation & Cropping</div>
					<InputContainer
						type="checkbox"
						label="Flipping"
						helpText="Horizontal"
						checked={content?.flipping}
						onChange={(e: any) =>
							setContent({
								...content,
								flipping: e.target.checked,
							})
						}
					/>
					<InputContainer
						type="select"
						label="Rotation"
						selected={content?.rotation}
						onChange={(e: any) =>
							setContent({
								...content,
								rotation: e.target.value,
							})
						}
					>
						<option value="0">0º</option>
						<option value="90">90º</option>
						<option value="180">180º</option>
						<option value="270">270º</option>
					</InputContainer>
					<InputContainer
						type="select"
						label="Cropping"
						selected={content?.cropping}
						onChange={(e: any) =>
							setContent({ ...content, cropping: e.target.value })
						}
					>
						<option value="none">None</option>
						<option value="conservative">Conservative</option>
						<option value="automatic">Automatic</option>
					</InputContainer>
				</div>
				<div className={styles.middle}>
					<div className={styles.label}>Resolution & Scaling</div>
					<InputContainer
						type="select"
						label="Limit"
						selected={content?.limit}
						onChange={(e: any) =>
							setContent({
								...content,
								limit: e.target.value,
							})
						}
					>
						<option value="none">None</option>
						<option value="480">480p NTSC SD</option>
						<option value="576">576p Pal SD</option>
						<option value="720">720p HD</option>
						<option value="1080">1080p</option>
						<option value="1440">1440p 2.5k Quad HD</option>
						<option value="2160">2160p 4k Ultra HD</option>
						<option value="4320">4320p 8k Ultra HD</option>
					</InputContainer>
					<InputContainer
						type="select"
						label="Anamorphic"
						selected={content?.anamorphic}
						onChange={(e: any) =>
							setContent({ ...content, anamorphic: e.target.value })
						}
					>
						<option value={"automatic"}>Automatic</option>
						<option value={"off"}>Off</option>
					</InputContainer>
				</div>
				<div className={styles.right}>
					<div className={styles.label}>Borders</div>
					<InputContainer
						type="select"
						label="Fill"
						selected={content?.fill}
						onChange={(e: any) =>
							setContent({ ...content, fill: e.target.value })
						}
					>
						<option value="none">None</option>
						<option value="height">Height (Letterbox)</option>
						<option value="width">Width (Pillarbox)</option>
						<option value="width height">Width & Height</option>
					</InputContainer>

					<InputContainer
						type="select"
						label="Color"
						selected={content?.color}
						disabled={content?.fill == "none"}
						onChange={(e: any) =>
							setContent({
								...content,
								color: e.target.value,
							})
						}
					>
						<option value="black">Black</option>
						<option value="dark gray">Dark Gray</option>
						<option value="gray">Gray</option>
						<option value="white">White</option>
					</InputContainer>
				</div>
			</div>
		</div>
	);
};
export default ProfileDimensions;
