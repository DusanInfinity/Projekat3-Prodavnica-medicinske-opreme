import React, { useState, useEffect } from "react";
import "./App.css";
import { useParams } from "react-router-dom";
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

	const NemaProizvoda = () => {
		if (items.length === 0) {
			return (
				<div className="mt-5">
					<h2>Žao nam je, trenutno nema proizvoda!</h2>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<h3 className="mt-3">{kat}</h3>
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
			<NemaProizvoda />
		</div>
	);
}

export default Kategorija;
