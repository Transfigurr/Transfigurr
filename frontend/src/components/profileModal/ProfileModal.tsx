import styles from "./ProfileModal.module.scss";
import useCodecs from "../../hooks/useCodecs";
import useContainers from "../../hooks/useContainers";

const ProfileModal = ({ content, setContent }: any) => {
	const codecs: any = useCodecs();
	const presets: any = [
		"veryslow",
		"slower",
		"slow",
		"medium",
		"fast",
		"faster",
		"veryfast",
		"superfast",
		"ultrafast",
	];
	const containers: any = useContainers();

	console.log("codecs", codecs);
	console.log("containers", containers);
	console.log("content", content);

	return (
		<div className={styles.content}>
			<label>
				Name
				<input
					type="input"
					value={content.name}
					onChange={(e) => setContent({ ...content, name: e.target.value })}
				/>
			</label>
			<label>
				Wanted Codec
				<select
					value={content.codec}
					onChange={(e) => setContent({ ...content, codec: e.target.value })}
				>
					{Object.entries(codecs).map(([key, value]: any) => (
						<option value={key}>{key}</option>
					))}
				</select>
			</label>
			<label>
				Encoder
				<select
					value={content.encoder}
					onChange={(e) => setContent({ ...content, encoder: e.target.value })}
				>
					{codecs[content?.codec]?.encoders?.map((encoder: string) => (
						<option value={encoder}>{encoder}</option>
					))}
				</select>
			</label>
			<label>
				Targets
				<select
					multiple
					value={content.codecs}
					onChange={(e) => {
						const selectedValues = Array.from(
							e.target.selectedOptions,
							(option) => option.value
						);
						setContent({ ...content, codecs: selectedValues });
					}}
				>
					{Object.entries(codecs).map(([key, value]: any) => (
						<option key={key} value={key}>
							{key}
						</option>
					))}
				</select>
			</label>
			<label>
				Encode Speed
				<select
					value={content.speed}
					onChange={(e) => setContent({ ...content, speed: e.target.value })}
				>
					{presets.map((preset: any) => (
						<option value={preset}>{preset}</option>
					))}
				</select>
			</label>
			<label>
				Output Container
				<select
					value={content.container}
					onChange={(e) =>
						setContent({ ...content, container: e.target.value })
					}
				>
					{codecs[content?.codec]?.containers.map((container: any) => (
						<option value={container}>{container}</option>
					))}
				</select>
			</label>
			<label>
				Output Extension
				<select
					value={content.extension}
					onChange={(e) =>
						setContent({ ...content, extension: e.target.value })
					}
				>
					{containers[content?.container]?.extensions?.map((extension: any) => (
						<option value={extension}>{extension}</option>
					))}
				</select>
			</label>
		</div>
	);
};
export default ProfileModal;
