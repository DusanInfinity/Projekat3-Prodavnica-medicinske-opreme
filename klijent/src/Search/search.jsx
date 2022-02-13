import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Item from "../Item";
import "../App.css";
import ApiClient from "../Global/apiClient";
import { Alert } from "bootstrap";

function Search({ korpaCounter, setKorpaCounter }) {
	const api = new ApiClient();

	let { parametri } = useParams();
	const [items, setItems] = useState([]);

	useEffect(() => {
		fetchItems();
	}, [parametri]);

	const fetchItems = async () => {
		try {
			if (parametri.length < 1) return;
			const data = await api.produkti.pretraziProdukte(parametri);
			setItems(data);
		} catch (e) {
			alert(e.message);
		}
	};

	const [randomProizvodi, setRandomProizvodi] = useState([]);

	useEffect(() => {
		if (items.length === 0) {
			fetchRandomProizvode();
		}
	}, [items]);

	const fetchRandomProizvode = async () => {
		try {
			const data = await api.produkti.vratiNasumicneProdukte();
			setRandomProizvodi(data.slice(0, 4)); // 4-5 proizvoda da vraca ili 8-10
		} catch (e) {
			alert(e.message);
		}
	};

	const NemaRezultataPretrage = () => {
		if (items.length === 0) {
			return (
				<div className="mt-5 col-md-12 d-flex flex-column align-items-center">
					<div
						className="col-md-12"
						style={{
							textAlign: "center",
							borderBottom: "1px solid lightgray",
						}}
					>
						<h3>Nasumični proizvodi</h3>
					</div>
					<div className="proizvodi-container col-sm-12">
						{randomProizvodi.map((item) => {
							return (
								<Item
									key={item.productCode}
									proizvod={item}
									korpaCounter={korpaCounter}
									setKorpaCounter={setKorpaCounter}
								/>
							);
						})}
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<div className="mt-4" style={{ textAlign: "center" }}>
				{items.length !== 0 ? (
					<h3>Rezultat pretrage za parametre "{parametri}".</h3>
				) : (
					<h3>Nema rezultata za vašu pretragu "{parametri}".</h3>
				)}
			</div>
			<div className="proizvodi-container col-sm-12">
				{items.map((item) => {
					return (
						<Item
							key={item.productCode}
							proizvod={item}
							korpaCounter={korpaCounter}
							setKorpaCounter={setKorpaCounter}
						/>
					);
				})}
			</div>
			<NemaRezultataPretrage />
		</div>
	);
}

export default Search;
