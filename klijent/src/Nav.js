import React, { useEffect, useState } from "react";
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
		"Deciji kutak",
		"Muski kutak",
		"Lekovi",
		"Zenski kutak",
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
						style={{ fontSize: "2rem", color: "blue" }}
					></i>
					<Link
						to={"/"}
						className="mx-2"
						style={{ textDecoration: "none" }}
						onClick={() => {
							alert("Uspesno ste se odjavili!");
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
						style={{ fontSize: "2rem", color: "blue" }}
					></i>
					<Link to={"/login"} className="mx-2">
						Prijava
					</Link>
					/
					<Link to={"/registracija"} className="mx-2">
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
							className="btn btn-secondary"
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
							handleCloseDodaj();
							const product = {
								productCode: produktKod,
								name: naziv,
								price: cena,
								quantity: kolicina,
								description: deskripcija,
								image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
								category: kategorija,
							};
							try {
								api.setHeader(
									"Content-Type",
									"application/json"
								);
								await api.produkti.dodajProdukt(product);
								alert("Produkt uspesno dodat");
								window.location.reload();
							} catch (e) {
								alert(
									`Probajte sa drugim produkt kodom. ${e.message}`
								);
							}
						}}
					>
						Sacuvaj izmene
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	return (
		<nav>
			<div className="col-md-12 border-gray border-bottom d-flex justify-content-center">
				<NavigacioniDugmici />
			</div>
			<div className="nav col-md-8 justify-content-between">
				<Link to={"/"}>
					<img className="logo-img" src={require("./Logo.png")}></img>
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
				<div className="col-md-3 d-flex justify-content-between align-items-center">
					<Link
						to={"/korpa"}
						className="col-md-6 d-flex-row justify-content-between"
						style={{ textDecoration: "none" }}
					>
						<div className="">
							<i
								className="bi bi-cart me-2"
								style={{ fontSize: "1.2rem" }}
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
