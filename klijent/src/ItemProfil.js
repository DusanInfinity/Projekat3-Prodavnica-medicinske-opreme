import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";
import KomentariProfil from "./komentariProfil";

function ItemProfil() {
	let { id } = useParams();

	useEffect(() => {
		fetchItem();
	}, []);

	const [item, setItem] = useState([]);

	const fetchItem = async () => {
		// api za fetch item

		const data = {
			productCode: 1,
			name: "Bel London poklon set",
			price: 12000,
			quantity: 10,
			description: "deskripcija",
			image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
			category: "set",
		};

		setItem(data);
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
								}
							} else {
								korpaProizvodi = [];
								korpaProizvodi.push({
									productCode: item.productCode,
									kolicina: kolicina,
								});
							}

							localStorage.setItem(
								"korpa_proizvodi",
								JSON.stringify(korpaProizvodi)
							);
						}}
					>
						<i className="bi bi-cart me-2"></i>Dodaj u korpu
					</button>
					<DodajUListuZelja />
				</div>
			);
		} else {
			return (
				<DodajUListuZelja />
			);
		}
	}

	const DodajUListuZelja = () => {
		return (
			<button
				className="btn btn-outline-primary"
				style={{ fontSize: "1.2rem" }}
				onClick={() => {
					console.log("dodaj u listu zelja");
					// api za dodavanje proizvoda u listu zelja
				}}
			>
				<i className="bi bi-heart"></i>
			</button>
		);
	};

	return (
		<div className="col-md-8 d-flex flex-column">
			<div className="proizvod-profil-container col-md-12 d-flex">
				<img
					src={item.image}
					alt="/"
					className="col-md-6"
					style={{ height: "60vh", width: "auto", objectFit: "" }}
				/>
				<div className="proizvod-profil-data col-md-6">
					<h2>{item.name}</h2>
					<ProizvodNaStanju kolicina={item.quantity} />
					<hr />
					<h5>{item.description}</h5>
					<h2 style={{ fontWeight: "bold", color: "#e6127c" }}>
						{formatPrice(item.price)}
					</h2>
					<DodajUKorpu kol={item.quantity} />
					<hr />
					<FormaEmail kolicina={item.quantity} />
				</div>
			</div>
			<KomentariProfil productCode={item.productCode} />

			<div style={{ height: "200px" }}></div>
		</div>
	);
}

export default ItemProfil;
