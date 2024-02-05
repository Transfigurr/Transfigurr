import React, { useState } from "react";

interface LoginProps {
	onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onLogin(username, password);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Username:
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</label>
			<label>
				Password:
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</label>
			<input type="submit" value="Login" />
		</form>
	);
};

export default Login;
