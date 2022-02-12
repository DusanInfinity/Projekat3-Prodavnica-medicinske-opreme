import React, { useState, useEffect } from "react";
import "../App.css";
import { Link, useParams } from "react-router-dom";
import "./ListaZelja.css";

function ItemListaZelja({ proizvod, izbaciItem }) {
	useEffect(() => {
		fetchItem();
	}, []);

	const [item, setItem] = useState([]);

	const fetchItem = async () => {
		const data = proizvod;

		setItem(data);
	};

	return (
		<div className="lista-zelja-proizvod-container col-md-12">
			<div className="d-flex flex-row">
				<Link to={`/item/${item.productCode}`}>
					<img src={item.image} alt="/" />
				</Link>
				<div className="lista-zelja-proizvod-data">
					<h4>{item.name}</h4>
					<h4 style={{ color: "red", fontWeight: "700" }}>
						{item.price} RSD
					</h4>
				</div>
			</div>
			<div className="d-flex align-items-center">
				<button
					className="btn btn-outline-dark"
					onClick={() => {
						izbaciItem(item);
                        // api za izbacivanje proizvoda iz liste zelja
					}}
				>
					Izbaci
				</button>
			</div>
		</div>
	);
}

export default ItemListaZelja;
