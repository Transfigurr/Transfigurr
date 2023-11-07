import React from "react";
import "./Login.module.scss";

const LoginComponent = () => {
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />

				<meta name="description" content="Sonarr" />

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/Content/Images/Icons/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/Content/Images/Icons/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/Content/Images/Icons/favicon-16x16.png"
				/>
				<link
					rel="manifest"
					href="/Content/Images/Icons/manifest.json"
					crossOrigin="use-credentials"
				/>
				<link
					rel="mask-icon"
					href="/Content/Images/Icons/safari-pinned-tab.svg"
					color="#00ccff"
				/>
				<link
					rel="shortcut icon"
					type="image/ico"
					href="/favicon.ico"
					data-no-hash
				/>
				<meta
					name="msapplication-config"
					content="/Content/Images/Icons/browserconfig.xml"
				/>

				<link rel="stylesheet" type="text/css" href="/Content/styles.css" />
				<link
					rel="stylesheet"
					type="text/css"
					href="/Content/Fonts/fonts.css"
				/>

				<title>Login - Sonarr</title>
			</head>
			<body>
				<div className="center">
					<div className="content">
						<div className="panel">
							<div className="panel-header">
								<img
									src="/Content/Images/logo.svg"
									alt="Logo"
									className="logo"
								/>
							</div>

							<div className="panel-body">
								<div className="sign-in">SIGN IN TO CONTINUE</div>

								<form data-parsley-validate="" className="mb-lg" method="POST">
									<div className="form-group">
										<input
											type="email"
											name="username"
											className="form-input"
											placeholder="Username"
											autoComplete="off"
											pattern=".{1,}"
											required
											title="User name is required"
											autoFocus={true}
											autoCapitalize="false"
										/>
									</div>

									<div className="form-group">
										<input
											type="password"
											name="password"
											className="form-input"
											placeholder="Password"
											required
										/>
									</div>

									<div className="remember-me-container">
										<span className="remember-me">
											<input
												type="checkbox"
												name="rememberMe"
												id="rememberMe"
												checked={true}
											/>
											<label htmlFor="rememberMe">Remember Me</label>
										</span>

										<a
											href="https://wiki.servarr.com/sonarr/faq#help-i-have-locked-myself-out"
											className="forgot-password"
										>
											Forgot your password?
										</a>
									</div>
									<button type="submit" className="button">
										Login
									</button>

									<div id="login-failed" className="login-failed hidden">
										Incorrect Username or Password
									</div>
								</form>
							</div>
						</div>

						<div id="copy" className="copy hidden">
							<span>&copy;</span>
							<span id="year"></span>
							<span>-</span>
							<span>Encodarr</span>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
};

export default LoginComponent;
