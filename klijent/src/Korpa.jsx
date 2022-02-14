import React, { useState, useEffect } from "react";
import "./App.css";
import ItemKorpa from "./ItemKorpa";
import FormaPorudzbina from "./Korpa/FormaPorudzbina";
import ApiClient from "./Global/apiClient";
import { useNavigate } from "react-router-dom";

function Korpa({ korpaCounter, setKorpaCounter }) {
	const api = new ApiClient();

	const navigate = new useNavigate();

	const [items, setItems] = useState([]);
	const [ukupnaCena, setUkupnaCena] = useState(0);
	const [otvoriFormu, setOtvoriFormu] = useState(false);

	useEffect(() => {
		fetchItems();
	}, []);

	useEffect(() => {
		let cena = 0;
		for(const item of items){
			cena += item.price * item.kolicina;
		};
		setUkupnaCena(cena);
	}, [items]);


	function formatPrice(price) {
		return new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "RSD",
		}).format(price);
	}

	const onPlus = (item) => {
		const exists = items.find((x) => x.productCode === item.productCode);
		if (exists) {
			setUkupnaCena(ukupnaCena + item.price);
		}
	};

	const onMinus = (item) => {
		const exists = items.find((x) => x.productCode === item.productCode);
		if (exists) {
			setUkupnaCena(ukupnaCena - item.price);
		}
	};

	const fetchItems = async () => {
		let produktiExists = JSON.parse(
			localStorage.getItem("korpa_proizvodi")
		);
		let novi_objekti = [];

		if (!produktiExists) return;
		for (const el of produktiExists) {
			try {
				let pom = await api.produkti.vratiPodatkeProdukta(
					el.productCode
				);
				pom.kolicina = el.kolicina;
				novi_objekti.push(pom);
			} catch (e) {
				alert(e.message);
			}
		}

		setItems(novi_objekti);
	};

	const isprazniKorpu = () => {
		setItems([]);
		localStorage.removeItem("korpa_proizvodi");
	};

	return (
		<div className="col-md-8 d-flex flex-column align-items-center">
			<h2 className="my-4">Korpa</h2>
			{items.length !== 0 && (
				<div className="col-md-12">
					<div className="col-md-12 d-flex justify-content-between">
						<table className="col-md-9 korpa-tabela">
							<thead className="col-md-12">
								<tr
									style={{
										width: "100%",
										textAlign: "center",
									}}
								>
									<th
										style={{
											width: "50%",
											display: "inline-block",
											textAlign: "start",
										}}
									>
										Proizvod
									</th>
									<th
										style={{
											width: "10%",
											display: "inline-block",
										}}
									>
										Cena
									</th>
									<th
										style={{
											width: "20%",
											display: "inline-block",
										}}
									>
										Količina
									</th>
									<th
										style={{
											width: "20%",
											display: "inline-block",
										}}
									>
										Suma
									</th>
								</tr>
							</thead>
							<tbody>
								{items.map((item) => {
									return (
										<ItemKorpa
											korpaCounter={korpaCounter}
											setKorpaCounter={setKorpaCounter}
											key={item.productCode}
											proizvod={item}
											cena={item.ukupnaCena}
											onPlus={onPlus}
											onMinus={onMinus}
											items={items}
											setItems={setItems}
										/>
									);
								})}
							</tbody>
						</table>
						<div className="col-md-3 ps-3">
							<div style={{textAlign: "right"}}>
								<h3 className="border-bottom pb-2 mb-2">
									Pregled:
								</h3>
							</div>
							<div className="border-bottom mb-2"  style={{textAlign: "right"}}>
								<label>Medjuzbir</label>
								<h2>{formatPrice(ukupnaCena)}</h2>
							</div>
							<div className="border-bottom mb-2"  style={{textAlign: "right"}}>
								<label>Dostava</label>
								<h2>0 RSD</h2>
							</div>
							<div className="border-bottom mb-2"  style={{textAlign: "right"}}>
								<label>Ukupno</label>
								<h2>{formatPrice(ukupnaCena)}</h2>
							</div>
							<div  style={{textAlign: "right"}}>
								<button
									className="btn btn-outline-primary"
									onClick={() => {
										if (items.length !== 0) {
											setOtvoriFormu(!otvoriFormu);
										} else {
											alert("Nemate proizvode u korpi.");
										}
									}}
								>
									Nastavi porudžbinu
								</button>
							</div>
						</div>
					</div>
					<FormaPorudzbina
						otvoriFormu={otvoriFormu}
						items={items}
						isprazniKorpu={isprazniKorpu}
						korpaCounter={korpaCounter}
						setKorpaCounter={setKorpaCounter}
					/>
				</div>
			)}
			{items.length === 0 && (
				<div
					className="col-md-9 d-flex flex-column align-items-center justify-content-center"
					style={{ background: "#d9fbff", height: "300px" }}
				>
					<h5>Trenutno nema proizvoda u korpi</h5>
					<button
						className="btn btn-outline-dark"
						style={{ width: "300px" }}
						onClick={() => {
							navigate("/");
						}}
					>
						Vratite se na početnu stranicu
					</button>
				</div>
			)}
		</div>
	);
}

export default Korpa;
