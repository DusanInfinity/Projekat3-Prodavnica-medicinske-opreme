import React, { useState, useEffect } from "react";
import "./App.css";
import { useParams } from "react-router-dom";
import KomentariProfil from "./komentariProfil";
import ApiClient from "./Global/apiClient";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ItemProfil({ korpaCounter, setKorpaCounter }) {
	const api = new ApiClient();

	const navigate = useNavigate();

	let { id } = useParams();

	const [item, setItem] = useState([]);
	const [prosecnaOcena, setProsecnaOcena] = useState(0);
	const [trenutnaOcena, setTrenutnaOcena] = useState(0);
	const [zvezdice, setZvezdice] = useState([]);

	//modal stvari
	const [showIzmeni, setShowIzmeni] = useState(false);
	const handleCloseIzmeni = () => setShowIzmeni(false);
	const handleShowIzmeni = () => setShowIzmeni(true);

	const [showObrisi, setShowObrisi] = useState(false);
	const handleCloseObrisi = () => setShowObrisi(false);
	const handleShowObrisi = () => setShowObrisi(true);

	useEffect(() => {
		fetchItem();
		inicijalizujZvezdice(id);
	}, []);

	useEffect(() => {
		obojiZvezdice();
	}, [zvezdice, trenutnaOcena]);

	const fetchItem = async () => {
		try {
			const data = await api.produkti.vratiPodatkeProdukta(id);
			setItem(data);
			const ocena = await api.ocene.vratiBrojOcenaIProsek(id);
			setProsecnaOcena(ocena.item2);
		} catch (e) {
			alert(e.message);
		}
	};

	function formatPrice(price) {
		return new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "RSD",
		}).format(price);
	}

	function ProizvodNaStanju({ kolicina }) {
		if (kolicina > 0) {
			return (
				<h5 style={{ color: "#6bd16b" }}>
					<i className="bi bi-check2"></i> Na stanju
				</h5>
			);
		} else {
			return (
				<h5 style={{ color: "red" }}>
					<i className="bi bi-x"></i> Proizvod nije na stanju
				</h5>
			);
		}
	}

	function FormaEmail({ kolicina }) {
		const [email, setEmail] = useState("");

		const handleSubmit = (e) => {
			var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			e.preventDefault();
			if (email === "") {
				alert("Niste uneli email.");
			} else if (!email.match(mailformat)) {
				alert("Niste uneli validan email.");
			} else {
				alert(email);
			}
		};

		if (kolicina > 0) {
			return null;
		} else {
			return (
				<form onSubmit={handleSubmit}>
					<label style={{ fontSize: "1rem" }}>
						Primite obavestenje kada proizvod bude na stanju.
					</label>
					<div className="input-group">
						<input
							type="text"
							name={email}
							className={"form-control"}
							id=""
							value={email}
							placeholder={"Email..."}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<div className="input-group-append"></div>
						<button
							className="btn btn-outline-primary"
							type="Submit"
						>
							Posalji
						</button>
					</div>
				</form>
			);
		}
	}

	function DodajUKorpu({ kol }) {
		const [kolicina, setKolicina] = useState(0);
		if (kol > 0) {
			return (
				<div className="d-flex justify-content-start align-items-center">
					<div className="me-4">
						<div className="input-group">
							<div className="input-group-prepend">
								<button
									className="btn btn-outline-dark rounded-0 rounded-start"
									style={{ width: "40px" }}
									onClick={() => {
										if (kolicina > 0) {
											setKolicina(kolicina - 1);
										}
									}}
								>
									-
								</button>
							</div>
							<input
								type="text"
								disabled={true}
								value={kolicina}
								style={{
									width: "40px",
									textAlign: "center",
									boxSizing: "border-box",
									outline: "none",
									border: "1px solid gray",
									cursor: "pointer",
								}}
							/>
							<div className="input-group-append">
								<button
									className="btn btn-outline-dark rounded-0 rounded-end"
									style={{ width: "40px" }}
									onClick={() => {
										if (kolicina < kol) {
											setKolicina(kolicina + 1);
										}
									}}
								>
									+
								</button>
							</div>
						</div>
					</div>
					<button
						className="btn me-4"
						style={{
							color: "white",
							background: "#fe7234",
							fontSize: "1.2rem",
						}}
						onClick={() => {
							if (kolicina === 0) {
								return;
							}
							let korpaProizvodi =
								localStorage.getItem("korpa_proizvodi");
							if (korpaProizvodi) {
								korpaProizvodi = JSON.parse(korpaProizvodi);
								let exists = korpaProizvodi.find(
									(el) => el.productCode === item.productCode
								);
								if (exists) {
									exists.kolicina = kolicina;
								} else {
									korpaProizvodi.push({
										productCode: item.productCode,
										kolicina: kolicina,
									});

									setKorpaCounter(korpaCounter + 1);
								}
							} else {
								korpaProizvodi = [];
								korpaProizvodi.push({
									productCode: item.productCode,
									kolicina: kolicina,
								});

								setKorpaCounter(korpaCounter + 1);
							}

							localStorage.setItem(
								"korpa_proizvodi",
								JSON.stringify(korpaProizvodi)
							);
							alert(
								`Uspe??no ste dodali proizvod ${item.name} u korpu.`
							);
						}}
					>
						<i className="bi bi-cart me-2"></i>Dodaj u korpu
					</button>
				</div>
			);
		} else {
			return null;
		}
	}

	const AdminFunkcionalnosti = () => {
		const data = sessionStorage.getItem("user");
		if (data) {
			const user = JSON.parse(data);
			if (user.role === "Admin") {
				return (
					<div>
						<h4 style={{ textAlign: "center" }}>
							Admin funkcionalnosti
						</h4>
						<div className="col-md-12 d-flex justify-content-around mt-3">
							<button
								className="btn btn-warning"
								onClick={handleShowIzmeni}
							>
								Izmeni proizvod
							</button>
							<button
								className="btn btn-danger"
								onClick={handleShowObrisi}
							>
								Obri??i proizvod
							</button>
						</div>
					</div>
				);
			}
			return null;
		} else {
			return null;
		}
	};

	const ModalIzmeni = () => {
		const [naziv, setNaziv] = useState(item.name);
		const [cena, setCena] = useState(item.price);
		const [deskripcija, setDeskripcija] = useState(item.description);
		const [kolicina, setKolicina] = useState(item.quantity);

		return (
			<Modal show={showIzmeni} onHide={handleCloseIzmeni}>
				<Modal.Header closeButton>
					<Modal.Title>Izmena proizvoda {item.name}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
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
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseIzmeni}>
						Zatvori
					</Button>
					<Button
						variant="primary"
						onClick={async () => {
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

							handleCloseIzmeni();
							const product = {
								productCode: item.productCode,
								name: naziv,
								price: cena,
								quantity: kolicina,
								description: deskripcija,
								image: item.image,
							};
							try {
								api.setHeader(
									"Content-Type",
									"application/json"
								);
								await api.produkti.azurirajProdukt(product);
								alert(
									`Produkt ${product.name} Uspe??no azuriran!`
								);
								window.location.reload();
							} catch (e) {
								alert(e.message);
							}
						}}
					>
						Sa??uvaj izmene
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const ModalObrisi = () => {
		return (
			<Modal show={showObrisi} onHide={handleCloseObrisi}>
				<Modal.Header closeButton>
					<Modal.Title>Brisanje proizvoda</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Da li ste sigurni da zelite da obrisete proizvod{" "}
					<span style={{ fontWeight: "bold" }}>{item.name}</span>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseObrisi}>
						Zatvori
					</Button>
					<Button
						variant="danger"
						onClick={async () => {
							handleCloseObrisi();
							try {
								await api.produkti.obrisiProdukt(
									item.productCode
								);
								alert(
									`Uspe??no ste obrisali proizvod ${item.name} iz baze!`
								);
								navigate("/");
							} catch (e) {
								alert(e.message);
							}
						}}
					>
						Sa??uvaj
					</Button>
				</Modal.Footer>
			</Modal>
		);
	};

	const inicijalizujZvezdice = async (id) => {
		try {
			const ocena = await api.ocene.vratiKorisnikovuOcenu(id);
			let niz = [];
			for (let i = 1; i <= 5; i++) {
				if (i <= ocena) {
					niz.push({
						prvi: i,
						boji: true,
					});
				} else {
					niz.push({
						prvi: i,
						boji: false,
					});
				}
			}
			setTrenutnaOcena(ocena);
			setZvezdice(niz);
		} catch (e) {
			alert(e.message);
		}
	};

	const obojiZvezdice = async () => {
		let pom_niz = zvezdice;
		if (pom_niz.length > 0) {
			for (let i = 0; i < trenutnaOcena; i++) {
				pom_niz[i].boji = true;
			}
			for (let i = trenutnaOcena; i < 5; i++) {
				pom_niz[i].boji = false;
			}
		}
		setZvezdice(pom_niz);
	};

	const oceniZvezdice = async (redniBroj) => {
		const data = sessionStorage.getItem("user");
		if (data) {
			try {
				api.setHeader("Content-Type", "application/json");
				await api.ocene.oceniProizvod(item.productCode, redniBroj);
				setTrenutnaOcena(redniBroj);
				window.location.reload();
			} catch (e) {
				alert(e.message);
			}
		} else {
			alert("Morate biti prijavljeni da bi ste ocenili proizvod.");
			navigate("/login");
		}
	};

	const OceniProizvod = () => {
		return (
			<div className="d-flex">
				<div
					className="d-flex align-items-center mx-3"
					style={{ textAlign: "center" }}
				>
					<label style={{ fontSize: "2.5rem" }}>
						{prosecnaOcena}
					</label>
				</div>
				<div className="star-wrapper">
					{zvezdice.map((el) => {
						return (
							<i
								key={el.prvi}
								className={`bi bi-star-fill s${el.prvi} ${
									el.boji === true ? "active-star" : ""
								}`}
								onClick={() => oceniZvezdice(el.prvi)}
							></i>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className="col-md-8 d-flex flex-column">
			<div className="proizvod-profil-container col-md-12 d-flex">
				{item.image !== undefined && (
					<img
						src={require(`${item.image}`)}
						alt="/"
						className="col-md-6"
						style={{
							height: "60vh",
							width: "auto",
							objectFit: "cover",
						}}
					/>
				)}
				<div className="proizvod-profil-data col-md-6 p-5">
					<h1 style={{ fontWeight: "600" }}>{item.name}</h1>
					<ProizvodNaStanju kolicina={item.quantity} />
					<div>
						<OceniProizvod />
					</div>
					<hr />
					<h5>{item.description}</h5>
					<h2
						className="mt-3 mb-3"
						style={{ fontWeight: "bold", color: "#e6127c" }}
					>
						{formatPrice(item.price)}
					</h2>
					<DodajUKorpu kol={item.quantity} />
					<hr />
					<FormaEmail kolicina={item.quantity} />
					<AdminFunkcionalnosti />
				</div>
			</div>
			<KomentariProfil productCode={item.productCode} />
			<ModalIzmeni />
			<ModalObrisi />
			<div style={{ height: "200px" }}></div>
		</div>
	);
}

export default ItemProfil;
