import React, { useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Kategorije from "./kategorije";
import { Modal, Button } from "react-bootstrap";
import ApiClient from "./Global/apiClient";

function Nav({ korpaCounter }) {
	const api = new ApiClient();

	const [searchInput, setSearchInput] = useState("");

	const [showDodaj, setShowDodaj] = useState(false);
	const handleCloseDodaj = () => setShowDodaj(false);
	const handleShowDodaj = () => setShowDodaj(true);

	const kategorije = [
		"Parfemi",
		"Dečiji kutak",
		"Muški kutak",
		"Lekovi",
		"Ženski kutak",
	];

	let navigate = useNavigate();
	const pretraga = () => {
		let path = `search/${searchInput}`;
		let input = document.getElementById("search-input");
		input.value = "";
		navigate(path);
	};

	const NavigacioniDugmici = () => {
		let user = sessionStorage.getItem("user");
		if (user) {
			return (
				<div className="col-md-8 d-flex justify-content-end align-items-center">
					<i
						className="bi bi-person"
						style={{ fontSize: "2rem", color: "#0d6efd" }}
					></i>
					<Link
						to={"/"}
						className="mx-2"
						style={{ textDecoration: "none" }}
						onClick={() => {
							alert("Uspešno ste se odjavili!");
							sessionStorage.clear();
						}}
					>
						Logout
					</Link>
				</div>
			);
		} else {
			return (
				<div className="col-md-8 d-flex justify-content-end align-items-center">
					<i
						className="bi bi-person"
						style={{ fontSize: "2rem", color: "#0d6efd" }}
					></i>
					<Link
						to={"/login"}
						className="mx-2"
						style={{ textDecoration: "none" }}
					>
						Prijava
					</Link>
					/
					<Link
						to={"/registracija"}
						className="mx-2"
						style={{ textDecoration: "none" }}
					>
						Registracija
					</Link>
				</div>
			);
		}
	};

	const AdminFunkcionalnosti = () => {
		const data = sessionStorage.getItem("user");
		if (data) {
			const user = JSON.parse(data);
			if (user.role === "Admin") {
				return (
					<div className="mb-3">
						<button
							className="btn btn-success"
							onClick={handleShowDodaj}
						>
							Dodaj proizvod
						</button>
					</div>
				);
			}
			return null;
		} else {
			return null;
		}
	};

	const ModalDodajProizvod = () => {
		const [produktKod, setProduktKod] = useState("");
		const [naziv, setNaziv] = useState("");
		const [cena, setCena] = useState("");
		const [deskripcija, setDeskripcija] = useState("");
		const [kolicina, setKolicina] = useState("");
		const [kategorija, setKategorija] = useState("Lekovi");

		return (
			<Modal show={showDodaj} onHide={handleCloseDodaj}>
				<Modal.Header closeButton>
					<Modal.Title>Dodaj proizvod</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Produkt kod</label>
						<input
							type="text"
							className="col-md-8"
							onChange={(e) => setProduktKod(e.target.value)}
							value={produktKod}
							onKeyPress={(event) => {
								if (!/[0-9]/.test(event.key)) {
									event.preventDefault();
								}
							}}
						/>
					</div>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Naziv</label>
						<input
							type="text"
							className="col-md-8"
							onChange={(e) => setNaziv(e.target.value)}
							value={naziv}
						/>
					</div>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Cena</label>
						<input
							type="text"
							className="col-md-8"
							onChange={(e) => setCena(e.target.value)}
							value={cena}
							onKeyPress={(event) => {
								if (!/[0-9]/.test(event.key)) {
									event.preventDefault();
								}
							}}
						/>
					</div>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Deskripcija</label>
						<textarea
							type="text"
							className="col-md-8"
							onChange={(e) => setDeskripcija(e.target.value)}
							value={deskripcija}
						/>
					</div>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Kolicina</label>
						<input
							type="number"
							className="col-md-8"
							onChange={(e) => setKolicina(e.target.value)}
							value={kolicina}
							onKeyPress={(event) => {
								if (!/[0-9]/.test(event.key)) {
									event.preventDefault();
								}
							}}
						/>
					</div>
					<div className="col-md-12 d-flex justify-content-between mb-3">
						<label>Kategorija</label>
						<select
							className="col-md-8"
							style={{
								textDecoration: "none",
								background: "white",
								outline: "none",
							}}
							onChange={(e) => {
								setKategorija(e.target.value);
							}}
							defaultValue={"Lekovi"}
						>
							{kategorije.map((kat) => {
								return (
									<option key={kat} value={kat}>
										{kat}
									</option>
								);
							})}
						</select>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseDodaj}>
						Zatvori
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
							if (
								produktKod.length < 1 ||
								Number.isNaN(produktKod)
							) {
								alert("Niste uneli validan kod prudukta!");
								return;
							}
							if (naziv.length < 1) {
								alert("Niste uneli naziv!");
								return;
							}
							if (cena.length < 1 || Number.isNaN(cena)) {
								alert("Niste uneli cenu proizvoda!");
								return;
							}
							if (deskripcija.length < 1) {
								alert("Niste uneli deskripciju!");
								return;
							}
							if (kolicina.length < 1 || Number.isNaN(kolicina)) {
								alert("Niste uneli kolicinu proizvoda!");
								return;
							}

							handleCloseDodaj();

							const product = {
								productCode: produktKod,
								name: naziv,
								price: cena,
								quantity: kolicina,
								description: deskripcija,
								image: `./assets/${kategorija}.jpg`,
								category: kategorija,
							};
							try {
								api.setHeader(
									"Content-Type",
									"application/json"
								);
								await api.produkti.dodajProdukt(product);
								alert("Produkt Uspešno dodat");
								window.location.reload();
							} catch (e) {
								alert(
									`Probajte sa drugim produkt kodom. ${e.message}`
								);
							}
						}}
					>
						Sačuvaj proizvod
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const handleKeypress = (e) => {
		if (e.key === "Enter") {
			pretraga();
		}
	};

	return (
		<nav>
			<div className="col-md-12 border-gray border-bottom d-flex justify-content-center">
				<NavigacioniDugmici />
			</div>
			<div className="nav col-md-8 justify-content-between">
				<Link to={"/"}>
					<img className="logo-img rounded-pill" src={require("./Logo.png")} alt={"#"}></img>
				</Link>
				<div className="d-flex col-md-5 align-items-center">
					<div className="input-group">
						<input
							type="text"
							className="form-control"
							placeholder="Naziv proizvoda..."
							aria-describedby="basic-addon2"
							id="search-input"
							onChange={(e) => setSearchInput(e.target.value)}
							onKeyPress={handleKeypress}
						/>
						<div className="input-group-append">
							<button
								className="btn btn-outline-secondary"
								type="button"
								onClick={pretraga}
							>
								<i className="bi bi-search"></i>
							</button>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex justify-content-end align-items-center">
					<Link
						to={"/korpa"}
						className="col-md-6 d-flex-row justify-content-between"
						style={{ textDecoration: "none" }}
					>
						<div
							className=""
							style={{ fontSize: "1.2rem", color: "green", fontWeight: "bold" }}
						>
							<i
								className="bi bi-cart me-2"
								style={{ fontSize: "1.4rem" }}
							></i>
							Korpa (
							<span className="korpa-counter">
								{korpaCounter}
							</span>
							)
						</div>
					</Link>
				</div>
			</div>
			<Kategorije />
			<AdminFunkcionalnosti />
			<ModalDodajProizvod />
		</nav>
	);
}

export default Nav;
