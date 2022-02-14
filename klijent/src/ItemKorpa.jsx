import React, { useState, useEffect } from "react";
import "./App.css";
import { Link } from "react-router-dom";

function ItemKorpa({
	proizvod,
	onPlus,
	onMinus,
	items,
	setItems,
	korpaCounter,
	setKorpaCounter,
}) {
	const [item, setItem] = useState([]);
	const [kolicina, setKolicina] = useState(0);
	const [ukupnaSumaProizvoda, setukupnaSumaProizvoda] = useState(0);

	useEffect(() => {
		fetchItem();
	}, []);

	useEffect(() => {
		proizvod.ukupnaCena = ukupnaSumaProizvoda;
	}, [ukupnaSumaProizvoda]);

	useEffect(() => {
		updateLocalStorage();
		setukupnaSumaProizvoda(item.price * kolicina);
		for (let el of items) {
			if (el.productCode === item.productCode) {
				el.kolicina = kolicina;
			}
		}
	}, [kolicina]);

	useEffect(() => {
		setKolicina(proizvod.kolicina);
		setukupnaSumaProizvoda(item.price * kolicina);
	}, [item]);

	const updateLocalStorage = () => {
		let local = JSON.parse(localStorage.getItem("korpa_proizvodi"));
		let exists = local.find((el) => el.productCode === item.productCode);
		if (exists) {
			exists.kolicina = kolicina;
			localStorage.setItem("korpa_proizvodi", JSON.stringify(local));
		}
	};

	const deleteFromLocalStorage = () => {
		let local = JSON.parse(localStorage.getItem("korpa_proizvodi"));
		let exists = local.find((el) => el.productCode === item.productCode);
		if (exists) {
			local = local.filter((el) => el.productCode !== item.productCode);
			localStorage.setItem("korpa_proizvodi", JSON.stringify(local));
			alert(`Uspešno ste obrisali proizvod ${item.name} iz korpe.`);
		}
	};

	function formatPrice(price) {
		return new Intl.NumberFormat("de-DE", {
			style: "currency",
			currency: "RSD",
		}).format(price);
	}

	const brisanje = (item) => {
		const obrisani = items.filter(
			(i) => i.productCode !== item.productCode
		);
		setItems(obrisani);
		deleteFromLocalStorage();
	};

	const fetchItem = async () => {
		const data = proizvod;
		setItem(data);
	};

	return (
		<tr className="proizvod-container-korpa d-flex flex-row">
			<td
				className="d-flex align-items-center justify-content-start"
				style={{
					width: "50%",
				}}
			>
				<button
					className="btn"
					style={{ outline: "none", fontSize: "1.1rem" }}
					onClick={() => {
						setKorpaCounter(korpaCounter - 1);
						brisanje(item);
					}}
				>
					<i className="bi bi-trash"></i>
				</button>
				<Link to={`/item/${item.productCode}`}>
					{item.image !== undefined && (
						<img src={require(`${item.image}`)} alt="/" />
					)}
				</Link>
				<h5 className="mx-4">{item.name}</h5>
			</td>
			<td
				style={{
					width: "10%",
				}}
			>
				<h5>{formatPrice(item.price)}</h5>
			</td>

			<td
				style={{
					width: "20%",
				}}
			>
				<div className="">
					<div className="input-group">
						<div className="input-group-prepend">
							<button
								className="btn btn-outline-dark rounded-0 rounded-start"
								style={{ width: "40px" }}
								onClick={() => {
									if (kolicina > 0) {
										setKolicina(kolicina - 1);
										onMinus(item);
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
									if (kolicina < item.quantity) {
										setKolicina(kolicina + 1);
										onPlus(item);
									}
								}}
							>
								+
							</button>
						</div>
					</div>
				</div>
			</td>

			<td
				style={{
					width: "20%",
					textAlign: "center",
				}}
			>
				<h5>{formatPrice(ukupnaSumaProizvoda)}</h5>
			</td>
		</tr>
	);
}

export default ItemKorpa;
