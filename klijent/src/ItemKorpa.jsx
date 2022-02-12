import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function ItemKorpa({ proizvod, onPlus, onMinus, items, setItems }) {
	const [item, setItem] = useState([]);
	const [kolicina, setKolicina] = useState(0);
	const [ukupnaSumaProizvoda, setukupnaSumaProizvoda] = useState(0);

	useEffect(() => {
		fetchItem();
	}, []);

	useEffect(() => {
		setukupnaSumaProizvoda(item.price * kolicina);
	}, [kolicina, item]);

	useEffect(() => {
		proizvod.ukupnaCena = ukupnaSumaProizvoda;
	}, [ukupnaSumaProizvoda]);


	const brisanje = (item) => {
		const obrisani = items.filter((i) => i.productCode !== item.productCode);
		setItems(obrisani);
	}

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
					onClick={() => brisanje(item)}
				>
					<i className="bi bi-trash"></i>
				</button>
				<Link to={`/item/${item.productCode}`}>
					<img src={item.image} alt="/" />
				</Link>
				<label className="mx-4">{item.name}</label>
			</td>
			<td
				style={{
					width: "10%",
					display: "inline-block",
				}}
			>
				<label>{item.price} RSD</label>
			</td>

			<td
				style={{
					width: "20%",
					display: "inline-block",
				}}
			>
				<div className="mb-3">
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
					display: "inline-block",
					textAlign: "center",
				}}
			>
				{ukupnaSumaProizvoda} RSD
			</td>
		</tr>
	);
}

export default ItemKorpa;
