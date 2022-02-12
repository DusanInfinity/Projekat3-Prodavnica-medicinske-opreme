import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./login.css";
import ApiClient from "../Global/apiClient";

function Login() {
	const [email, setEmail] = useState("");
	const [lozinka, setLozinka] = useState("");

	const api = new ApiClient()

	const prijaviSe = async () => {
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (email === "") {
			alert("Niste uneli email.");
		} else if (!email.match(mailformat)) {
			alert("Niste uneli validan email.");
		} else {
			if (lozinka === "") {
				alert("Niste uneli lozinku");
			} else {
				const korisnik = {
					email: email,
					password: lozinka,
				};
				
				try{
					api.setHeader('Content-Type', 'application/json');
					let data = await api.korisnik.ulogujSe(korisnik);
					
    				sessionStorage.setItem('token', data.token);
					sessionStorage.setItem('user', JSON.stringify(data.user));
					navigate("/");
				}
				catch(e){
					sessionStorage.removeItem('user');
    				sessionStorage.removeItem('token');
					alert(`Greska pri logovanju, pokusajte ponovo. ${e.message}`);
				}
			}
		}
	};

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
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className="col-md-9 mt-5">
					<label>Lozinka:</label>
					<input
						type="password"
						name="password"
						id=""
						className="col-md-12"
						onChange={(e) => {
							setLozinka(e.target.value);
						}}
					/>
				</div>
				<div className="col-md-12 mt-5 ps-2">
					<button className="btn btn-primary" onClick={prijaviSe}>
						PRIJAVI SE
					</button>
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
						<button
							className="btn btn-primary mt-3"
							onClick={routeChange}
						>
							REGISTRACIJA
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
