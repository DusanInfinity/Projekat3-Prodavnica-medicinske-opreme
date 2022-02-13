import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Item from "../Item";
import "../App.css";
import ApiClient from "../Global/apiClient";
import { Alert } from "bootstrap";

function Search({korpaCounter, setKorpaCounter }) {
	const api = new ApiClient();

	let { parametri } = useParams();
	const [items, setItems] = useState([]);

	useEffect(() => {
		fetchItems();
	}, [parametri]);

	const fetchItems = async () => {

		try {
			if(parametri.length < 1) return;
			const data = await api.produkti.pretraziProdukte(parametri);
			setItems(data);
		} catch (e) {
			alert(e.message);
		}
	};

	return (
		<div className="col-md-8 d-flex flex-column justify-content-center align-items-center">
			<h3>Rezultat pretrage za parametre "{parametri}"</h3>
			<div className="proizvodi-container col-sm-12">
				{items.map((item) => {
					return <Item key={item.productCode} proizvod={item} korpaCounter={korpaCounter} setKorpaCounter={setKorpaCounter}/>;
				})}
			</div>
		</div>
	);
}

export default Search;
