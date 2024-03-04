import styles from "./ProfileVideo.module.scss";
import InputContainer from "../inputContainer/InputContainer";

const ProfileVideo = ({
	content,
	setContent,
	codecs,
	containers,
	encoders,
}: any) => {
	console.log(content);
	return (
		<div className={styles.section}>
			<div className={styles.top}>
				<div className={styles.left}>
					<InputContainer
						type="select"
						label="Video Codec"
						selected={content?.codec}
						onChange={(e: any) => {
							setContent({
								...content,
								codec: e.target.value,
								encoder: codecs[e.target.value]?.encoders[0],
								preset:
									encoders[codecs[e.target.value]?.encoders[0]]?.presets[0] ||
									"",
								container: codecs[e.target.value]?.containers[0],
								extension:
									containers[codecs[e.target.value].containers[0]]
										?.extensions[0],
							});
						}}
					>
						{Object.entries(codecs)?.map(([key, value]: any) => (
							<option value={key} key={key}>
								{key}
							</option>
						))}
					</InputContainer>
					<InputContainer
						type="select"
						label="Video Encoder"
						selected={content.encoder}
						onChange={(e: any) =>
							setContent({
								...content,
								encoder: e.target.value,
								preset: encoders[e.target.value]?.presets[0] || "",
								container: codecs[content?.codec]?.containers[0],
								extension:
									containers[codecs[content?.codec]?.containers[0]]
										?.extensions[0],
							})
						}
					>
						{codecs[content?.codec]?.encoders?.map(
							(encoder: string, index: number) => (
								<option value={encoder} key={index}>
									{encoder}
								</option>
							),
						)}
					</InputContainer>
					<InputContainer
						type="select"
						label="Framerate (FPS)"
						selected={content?.framerate}
						onChange={(e: any) =>
							setContent({ ...content, framerate: e.target.value })
						}
					>
						<option value="source">Same as source</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
						<option value="23.976">23.976 (NTSC Film)</option>
						<option value="24">24</option>
						<option value="25">25 (PAL Film/Video)</option>
						<option value="29.97">29.97 (NTSC Video)</option>
						<option value="30">30</option>
						<option value="50">50</option>
						<option value="59.94">59.94</option>
						<option value="60">60</option>
					</InputContainer>
					<InputContainer
						type="select"
						label="Framerate type"
						selected={content?.framerate_type}
						onChange={(e: any) =>
							setContent({ ...content, framerate_type: e.target.value })
						}
					>
						<option value="peak">Peak Framerate</option>
						<option value="constant">Constant Framerate</option>
					</InputContainer>
				</div>
				<div className={styles.right}>
					<InputContainer
						type="select"
						label="Quality Type"
						selected={content?.quality_type}
						onChange={(e: any) =>
							setContent({ ...content, quality_type: e.target.value })
						}
					>
						<option value="constant quality">Constant Quality</option>
						<option value="average bitrate">Average Bitrate (kbps)</option>
					</InputContainer>
					<InputContainer
						type="text"
						label="Constant Quality"
						selected={content?.constant_quality}
						disabled={content?.quality_type != "constant quality"}
						onChange={(e: any) =>
							setContent({
								...content,
								constant_quality: e.target.value,
							})
						}
					/>
					<InputContainer
						type="text"
						label="Average Bitrate"
						disabled={content?.quality_type != "average bitrate"}
						selected={content?.average_bitrate}
						onChange={(e: any) =>
							setContent({
								...content,
								average_bitrate: e.target.value,
							})
						}
					/>
				</div>
			</div>
			<div className={styles.line}>Encoder Options</div>
			<div className={styles.bottom}>
				<div className={styles.left}>
					<InputContainer
						type="select"
						label="Preset"
						selected={content.preset}
						onChange={(e: any) =>
							setContent({ ...content, preset: e.target.value })
						}
					>
						{encoders[content?.encoder]?.presets?.map(
							(preset: any, index: number) => (
								<option value={preset} key={index}>
									{preset}
								</option>
							),
						)}
					</InputContainer>
					<InputContainer
						type="select"
						label="Tune"
						selected={content.tune}
						onChange={(e: any) => {
							setContent({ ...content, tune: e.target.value });
						}}
					>
						{encoders[content?.encoder]?.tune?.map(
							(tune: any, index: number) => (
								<option value={tune} key={index}>
									{tune}
								</option>
							),
						)}
					</InputContainer>
					<InputContainer
						type="select"
						label="Profile"
						selected={content.profile}
						onChange={(e: any) =>
							setContent({ ...content, profile: e.target.value })
						}
					>
						{encoders[content?.encoder]?.profile?.map(
							(profile: any, index: number) => (
								<option value={profile} key={index}>
									{profile}
								</option>
							),
						)}
					</InputContainer>
					<InputContainer
						type="select"
						label="Level"
						selected={content.level}
						onChange={(e: any) =>
							setContent({ ...content, level: e.target.value })
						}
					>
						{encoders[content?.encoder]?.level?.map(
							(level: any, index: number) => (
								<option value={level} key={index}>
									{level}
								</option>
							),
						)}
					</InputContainer>
				</div>
				<div className={styles.right}>
					{(content?.codec == "h264" || content?.codec == "av1") && (
						<InputContainer
							type="checkbox"
							label="Fast Decode"
							checked={content.fast_decode}
							onChange={(e: any) =>
								setContent({
									...content,
									fast_decode: e.target.checked,
								})
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
export default ProfileVideo;
