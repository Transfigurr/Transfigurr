import styles from "./ProfileModal.module.scss";
import useCodecs from "../../hooks/useCodecs";
import useSpeeds from "../../hooks/useSpeeds";

const ProfileModal = ({ content, setContent }: any) => {
	const codecs = useCodecs();
	const speeds = useSpeeds();

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
					{codecs.map((codec: any) => (
						<option value={codec}>{codec}</option>
					))}
				</select>
			</label>
			<label>
				Codecs to encode
				<select
					value={content.codecs}
					onChange={(e) => setContent({ ...content, codecs: e.target.value })}
				>
					{codecs.map((codec: any) => (
						<option value={codec}>{codec}</option>
					))}
				</select>
			</label>
			<label>
				Encode Speed
				<select
					value={content.speed}
					onChange={(e) => setContent({ ...content, speed: e.target.value })}
				>
					{speeds.map((speed: any) => (
						<option value={speed}>{speed}</option>
					))}
				</select>
			</label>
		</div>
	);
};
export default ProfileModal;
