import React, { createFactory, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./registracija.css";
import ApiClient from "../Global/apiClient";

function Registracija() {

	const navigate = useNavigate();

	const api = new ApiClient()

    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [adresa, setAdresa] = useState("");
    const [telefon, setTelefon] = useState("");
    const [email, setEmail] = useState("");
    const [lozinka, setLozinka] = useState("");

    const registruj = async () => {
        const korisnik = {
            firstname: ime,
            lastname: prezime,
            address: adresa,
            phoneNumber: telefon,
            email: email,
            password: lozinka,
        }

		try{
			api.setHeader('Content-Type', 'application/json');
			const user = await api.korisnik.registrujSe(korisnik);
			alert("Uspesna registracija");
			navigate("/login");
		}
		catch(e){
			alert(e.message);
		}
		
		// odvede na login stranicu ako je uspesno
    }

	return (
		<div className="col-md-8">
			<h3>Registracija</h3>
			<div className="col-md-12 d-flex">
				<div className="col-md-6">
					<h5>Licni podaci</h5>
					<hr className="col-md-11" />
					<div className="col-md-12 d-flex flex-column input-box">
						<label>Ime</label>
						<input
							type="text"
							name="ime"
							id="ime"
							className="col-md-9"
                            onChange={(e) => setIme(e.target.value)}
						/>
					</div>
					<div className="col-md-12 d-flex flex-column input-box">
						<label>Prezime</label>
						<input
							type="text"
							name="prezime"
							id="prezime"
							className="col-md-9"
                            onChange={(e) => setPrezime(e.target.value)}
						/>
					</div>
                    <div className="col-md-12 d-flex flex-column input-box">
						<label>Adresa</label>
						<input
							type="text"
							name="adresa"
							id="adresa"
							className="col-md-9"
                            
                            onChange={(e) => setAdresa(e.target.value)}
						/>
					</div>
                    <div className="col-md-12 d-flex flex-column input-box">
						<label>Telefon</label>
						<input
							type="text"
							name="telefon"
							id="telefon"
							className="col-md-9"
                            onChange={(e) => setTelefon(e.target.value)}
						/>
					</div>
				</div>
				<div className="col-md-6">
					<h5>Informacije o prijavi</h5>
					<hr className="col-md-10" />
					<div className="col-md-12 d-flex flex-column input-box">
						<label>Email adresa</label>
						<input
							type="text"
							name="email"
							id="email"
							className="col-md-9"
                            onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="col-md-12 d-flex flex-column input-box">
						<label>Lozinka</label>
						<input
							type="password"
							name="lozinka"
							id="lozinka"
							className="col-md-9"
                            onChange={(e) => setLozinka(e.target.value)}
						/>
					</div>
				</div>
			</div>
            <button className="btn btn-primary" onClick={() => {registruj()}}>REGISTRACIJA</button>
		</div>
	);
}

export default Registracija;
