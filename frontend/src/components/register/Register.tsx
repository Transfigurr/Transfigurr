import { useState } from "react";

function Register() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const credentials = {
			username: username,
			password: password,
		};

		const response = await fetch("http://localhost:8000/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		const data = await response.json();

		if (response.ok) {
			// Store the token in local storage
			localStorage.setItem("token", data.access_token);
		} else {
			// Handle error
			console.error(data.detail);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				placeholder="Username"
				required
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
				required
			/>
			<button type="submit">Register</button>
		</form>
	);
}

export default Register;
