import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function Item({ proizvod }) {
	useEffect(() => {
		fetchItem();
	}, []);

	const [item, setItem] = useState([]);

	const fetchItem = async () => {
		const data = proizvod;

		setItem(data);
	};

	return (
		<div className="proizvod-container">
			<Link to={`/item/${item.productCode}`}>
				<img src={item.image} alt="/" />
			</Link>
			<div className="">
				<h4>{item.name}</h4>
				<h4 style={{ color: "red", fontWeight: "700" }}>
					{item.price} RSD
				</h4>
				<div className="d-flex justify-content-around mb-3">
					<button
						className="btn btn-warning mx-2"
						onClick={() => {
							let korpaProizvodi =
								localStorage.getItem("korpa_proizvodi");
							if (korpaProizvodi) {
								korpaProizvodi = JSON.parse(korpaProizvodi);
								let exists = korpaProizvodi.find(
									(el) => el.productCode === item.productCode
								);
								if (!exists) {
									korpaProizvodi.push({
										productCode: item.productCode,
										kolicina: 1,
									});
								}
							} else {
								korpaProizvodi = [];
								korpaProizvodi.push({
									productCode: item.productCode,
									kolicina: 1,
								});
							}
							localStorage.setItem(
								"korpa_proizvodi",
								JSON.stringify(korpaProizvodi)
							);
						}}
					>
						<i
							className="bi bi-cart me-2"
							style={{ fontSize: "1.3rem" }}
						></i>
						Dodaj u korpu
					</button>
					<button
						className="btn btn-info mx-2"
						onClick={() => {
							console.log("dodaj u listu zelja");
							// api za dodavanje proizvoda u listu zelja
						}}
					>
						<i
							className="bi bi-heart"
							style={{ fontSize: "1.3rem" }}
						></i>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Item;
