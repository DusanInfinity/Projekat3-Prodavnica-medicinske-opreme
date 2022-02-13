import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../App.css";
import ApiClient from "../Global/apiClient";

function FormaPorudzbina({
	otvoriFormu,
	items,
	isprazniKorpu,
	korpaCounter,
	setKorpaCounter,
}) {
	let navigate = useNavigate();

	const api = new ApiClient();
	const [ime, setIme] = useState("");
	const [prezime, setPrezime] = useState("");
	const [telefon, setTelefon] = useState("");
	const [email, setEmail] = useState("");
	const [adresa, setAdresa] = useState("");
	if (!otvoriFormu) {
		return null;
	} else {
		const data = sessionStorage.getItem("user");
		let user;
		if(data){
			user = JSON.parse(data);
		}
		else{
			user = {
				firstname: "",
				lastname: "",
				address: "",
				phoneNumber: "",
			}
		}

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
								defaultValue={user.firstname}
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
								defaultValue={user.lastname}
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
								defaultValue={user.address}
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
								defaultValue={user.phoneNumber}
								onChange={(e) => setTelefon(e.target.value)}
								onKeyPress={(event) => {
									if (!/[0-9+]/.test(event.key)) {
										event.preventDefault();
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div>
					<button
						className="btn btn-danger ms-2 mt-3"
						onClick={async () => {
							let korisnik = {
								firstname: ime,
								lastname: prezime,
								address: adresa,
								phoneNumber: telefon,
							};

							let orderedProducts = [];
							for (let i = 0; i < items.length; i++) {
								let orderedItem = {
									productCode: items[i].productCode,
									quantity: items[i].kolicina,
								};
								orderedProducts.push(orderedItem);
							}

							let order = {
								customerData: korisnik,
								orderedProducts: orderedProducts,
							};

							try {
								api.setHeader(
									"Content-Type",
									"application/json"
								);
								await api.porudzbine.kupiProizvode(order);
								alert("Uspešno ste porucili proizvode!");
								isprazniKorpu();
								setKorpaCounter(0);
								navigate("/");
							} catch (e) {
								alert(e.message);
							}
						}}
					>
						Poruči
					</button>
				</div>
				<div style={{ height: "100px" }}></div>
			</div>
		);
	}
}

export default FormaPorudzbina;
