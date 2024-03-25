import InputCheckbox from "../inputs/inputCheckbox/InputCheckbox";
import InputContainer from "../inputs/inputContainer/InputContainer";
import styles from "./ProfileAudio.module.scss";
const ProfileAudio = ({ content, setContent }) => {
	const languages = {
		all: "All",
		eng: "English",
		spa: "Spanish",
		fra: "French",
		deu: "German",
		ita: "Italian",
		jpn: "Japanese",
		kor: "Korean",
		rus: "Russian",
		zho: "Chinese",
	};
	return (
		<>
			<div className={styles.section}>
				<div className={styles.left}>
					<InputContainer
						label="Include Untagged Audio Tracks"
						type="checkbox"
						checked={content?.map_untagged_audio_tracks}
						onChange={(e) => {
							setContent({
								...content,
								map_untagged_audio_tracks: e.target.checked,
							});
						}}
					/>
				</div>
				<div className={styles.right}>
					<label>Wanted Audio Tracks</label>
					<div className={styles.targets}>
						{Object.entries(languages)?.map(([key, value]: any) => (
							<div
								key={key}
								className={styles.target}
								style={
									!content?.audio_languages?.includes(key)
										? { opacity: "50%" }
										: {}
								}
								onClick={() => {
									const selectedValues = [...content.audio_languages];
									if (selectedValues.includes(key)) {
										const index = selectedValues.indexOf(key);
										if (index > -1) {
											selectedValues.splice(index, 1);
										}
									} else {
										selectedValues.push(key);
									}
									setContent({ ...content, audio_languages: selectedValues });
								}}
							>
								<InputCheckbox
									type="checkbox"
									checked={content?.audio_languages?.includes(key)}
									onChange={() => {
										undefined;
									}}
								/>
								<span className={styles.key}>{value}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};
export default ProfileAudio;
