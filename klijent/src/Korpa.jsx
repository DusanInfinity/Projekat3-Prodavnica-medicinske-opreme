import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import ItemKorpa from "./ItemKorpa";
import FormaPorudzbina from "./Korpa/FormaPorudzbina";
import ApiClient from "./Global/apiClient";

function Korpa() {
	const api = new ApiClient();

	const [items, setItems] = useState([]);
	const [ukupnaCena, setUkupnaCena] = useState(0);
	const [otvoriFormu, setOtvoriFormu] = useState(false);

	useEffect(() => {
		fetchItems();
	}, []);

	useEffect(() => {
		let cena = 0;
		items.map((item) => {
			cena += item.price * item.kolicina;
		});
		setUkupnaCena(cena);
	}, [items]);

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
	}

	return (
		<div className="col-md-8 d-flex flex-column align-items-center">
			<h1>Korpa page</h1>
			<div className="col-md-12 d-flex justify-content-between">
				<table className="col-md-9 korpa-tabela">
					<thead className="col-md-12">
						<tr
							style={{
								display: "block",
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
									verticalAlign: "middle",
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
								Kolicina
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
					<h3 className="border-bottom pb-2 mb-2">Pregled:</h3>
					<div className="border-bottom mb-2">
						<label>Medjuzbir</label>
						<h2>{ukupnaCena} RSD</h2>
					</div>
					<div className="border-bottom mb-2">
						<label>Dostava</label>
						<h2>0 RSD</h2>
					</div>
					<div className="border-bottom mb-2">
						<label>Ukupno</label>
						<h2>{ukupnaCena} RSD</h2>
					</div>
					<div>
						<button
							className="btn btn-outline-primary"
							onClick={() => {
								if (items.length !== 0) {
									setOtvoriFormu(!otvoriFormu);
								} else {
									alert("Nemate proizvode u korpi");
								}
							}}
						>
							Nastavi porudzbinu
						</button>
					</div>
				</div>
			</div>
			<FormaPorudzbina otvoriFormu={otvoriFormu} items={items} isprazniKorpu={isprazniKorpu}/>
		</div>
	);
}

export default Korpa;
