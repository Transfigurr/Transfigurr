import styles from "./ProfileVideo.module.scss";
import InputContainer from "../inputContainer/InputContainer";

const ProfileVideo = ({
	content,
	setContent,
	codecs,
	containers,
	encoders,
}: any) => {
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
					<InputContainer
						type="checkbox"
						label="Multi Pass Encoding"
						disabled={content?.quality_type != "average bitrate"}
						selected={content?.bitrate_mode}
						onChange={(e: any) =>
							setContent({
								...content,
								bitrate_mode: e.target.checked,
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
						<option value="none">none</option>
						<option value="psnr">psnr</option>
						<option value="ssim">ssim</option>
					</InputContainer>
					<InputContainer
						type="select"
						label="Profile"
						selected={content.profile}
						onChange={(e: any) =>
							setContent({ ...content, profile: e.target.value })
						}
					>
						<option value="main">main</option>
						<option value="auto">auto</option>
					</InputContainer>
					<InputContainer
						type="select"
						label="Level"
						selected={content.level}
						onChange={(e: any) =>
							setContent({ ...content, level: e.target.value })
						}
					>
						<option value="auto">auto</option>
						<option value="2.0">2.0</option>
						<option value="2.1">2.1</option>
						<option value="2.2">2.2</option>
						<option value="2.3">2.3</option>
						<option value="3.0">3.0</option>
						<option value="3.1">3.1</option>
						<option value="3.2">3.2</option>
						<option value="3.3">3.3</option>
						<option value="4.0">4.0</option>
						<option value="4.1">4.1</option>
						<option value="4.2">4.2</option>
						<option value="4.3">4.3</option>
						<option value="5.0">5.0</option>
						<option value="5.1">5.1</option>
						<option value="5.2">5.2</option>
						<option value="5.3">5.3</option>
						<option value="6.0">6.0</option>
						<option value="6.1">6.1</option>
						<option value="6.2">6.2</option>
						<option value="6.3">6.3</option>
					</InputContainer>
				</div>
				<div className={styles.right}>
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
				</div>
			</div>
		</div>
	);
};
export default ProfileVideo;
