import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./login.css";

function Login() {

	const [email, setEmail] = useState("");
	const [lozinka, setLozinka] = useState("");
	
	const prijaviSe = () => {
		const korisnik = {
			email: email,
			password: lozinka
		}
		console.log(korisnik);
	}

	let navigate = useNavigate();
	const routeChange = () => {
		let path = `/registracija`;
		navigate(path);
	};

	return (
		<div className="login-container col-md-8">
			<div className="col-md-6">
				<h3>Prijava</h3>
				<div className="col-md-9 mt-5">
					<label>Email adresa:</label>
					<input
						type="email"
						name="email"
						id=""
						className="col-md-12"
						onChange={(e) => {setEmail(e.target.value)}}
					/>
				</div>
				<div className="col-md-9 mt-5">
					<label>Lozinka:</label>
					<input
						type="password"
						name="password"
						id=""
						className="col-md-12"
						onChange={(e) => {setLozinka(e.target.value)}}
					/>
				</div>
				<div className="col-md-12 mt-5 ps-2">
					<button className="btn btn-primary" onClick={prijaviSe}>PRIJAVI SE</button>
				</div>
			</div>

			<div style={{ borderLeft: "1px solid lightgray" }}></div>

			<div className="col-md-6">
				<div className="col-md-12 d-flex flex-column p-5 justify-content-between">
					<h2>Niste registrovani?</h2>
					<p className="ps-2 mt-3" style={{ color: "gray" }}>
						Kreirajte nalog kako bi lakse mogli da koristite listu
						zelja i mogli da izvrsite kupovinu.
					</p>
					<div>
						<button className="btn btn-primary mt-3" onClick={routeChange}>
							REGISTRACIJA
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
