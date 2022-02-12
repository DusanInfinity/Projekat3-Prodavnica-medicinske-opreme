import React, { useState } from "react";
import "../App.css";

function FormaPorudzbina({ otvoriFormu, items }) {
	const [ime, setIme] = useState("");
	const [prezime, setPrezime] = useState("");
	const [telefon, setTelefon] = useState("");
	const [email, setEmail] = useState("");
	const [adresa, setAdresa] = useState("");

	if (!otvoriFormu) {
		return null;
	} else {
		return (
			<div className="mt-5 col-md-12">
				<h5>Podaci korisnika</h5>
				<hr className="col-md-12" />
				<div className="col-md-12 d-flex">
					<div className="d-flex flex-column col-md-6">
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
					</div>
					<div className="d-flex flex-column col-md-6">
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
				</div>
				<div>
					<button
						className="btn btn-danger ms-2 mt-3"
						onClick={() => {
							let korisnik = {
                                firstname: ime,
                                lastname: prezime,
                                address: adresa,
                                phoneNumber: telefon
                            };

                            console.log(items);

                            console.log(korisnik);
						}}
					>
						Plati
					</button>
				</div>
				<div style={{ height: "100px" }}></div>
			</div>
		);
	}
}

export default FormaPorudzbina;
