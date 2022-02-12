import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import ItemKorpa from "./ItemKorpa";
import FormaPorudzbina from "./Korpa/FormaPorudzbina";

function Korpa() {
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
		let a = localStorage.getItem("korpa_proizvodi");
		if (a) {
			a = JSON.parse(a);
		} else {
			console.log("korpa je prazna");
		}

		const data = [
			{
				productCode: 1,
				name: "Bel London poklon set",
				price: 12000,
				quantity: 10,
				description: "deskripcija",
				image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
				category: "set",
			},
			{
				productCode: 2,
				name: "Neki proba proizvod asdasdasdasdasd",
				price: 13000,
				quantity: 10,
				description: "deskripcija",
				image: "https://shop.lilly.rs/media/catalog/product/cache/e9fe89bb0d3d5e05736d64f06cc6558c/5/0/5060693811968_1.jpg",
				category: "proba",
			},
		];

		let objekti = [];
		if (a) {
			a.forEach((el, index) => {
				let novi_objekat = data[index];
				novi_objekat.kolicina = el.kolicina;
				objekti.push(novi_objekat);
			});
		}

		setItems(objekti);
	};

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
								}
								else{
									alert("Nemate proizvode u korpi");
								}
							}}
						>
							Nastavi ka placanju
						</button>
					</div>
				</div>
			</div>
			<FormaPorudzbina otvoriFormu={otvoriFormu} items={items}/>
		</div>
	);
}

export default Korpa;
