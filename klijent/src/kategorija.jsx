import React, { useState, useEffect } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";
import Item from "./Item";
import ApiClient from "./Global/apiClient";

function Kategorija({ korpaCounter, setKorpaCounter }) {
	const api = new ApiClient();
	let { kat } = useParams();

	useEffect(() => {
		fetchItems();
	}, [kat]);

	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		try {
			const data = await api.produkti.vratiProdukteUKategoriji(kat);
			setItems(data);
		} catch (e) {
			alert(e.message);
		}
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<h1>{kat}</h1>
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
		</div>
	);
}

export default Kategorija;
