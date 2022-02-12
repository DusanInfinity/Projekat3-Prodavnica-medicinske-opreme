import React, { useState, useEffect } from "react";
import "./App.css";
import ApiClient from "./Global/apiClient";

function KomentariProfil({ productCode }) {
	const api = new ApiClient();

	const [komentari, setKomentare] = useState([]);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		fetchComments();
	}, [productCode]);

	const fetchComments = async () => {
		try {
			if (productCode) {
				const comments = await api.komentari.vratiKomentare(
					productCode
				);
				console.log(comments);
				setKomentare(comments);
			}
		} catch (e) {
			alert(`Greska ${e.message}`);
		}
	};

	const prebaciVreme = (vreme) => {
		//2021-06-02T16:44:08
		let vremeLista = vreme.toString().split("T");
		vremeLista[0] = vremeLista[0].split("-").reverse().join(".");
		return vremeLista[0];
	};

	const DodajSvojKomentar = () => {
		const [text, setText] = useState("");

		const posaljiKomentar = async () => {
			const user = sessionStorage.getItem("user");
			if(user){
				let data = JSON.parse(user);
				const comment = {
					name: `${data.firstname} ${data.lastname}`,
					email: data.email,
					text: text,
					date: new Date(),
				}
				try{
					api.setHeader('Content-Type', 'application/json');
					await api.komentari.dodajKomentar(productCode, comment);
				}
				catch(e){
					alert(e.message);
				}
			}
			
		};

		return (
			<div className="col-md-12 d-flex flex-column align-items-center">
				<textarea
					name=""
					id=""
					rows="5"
					className="col-md-10 mt-3"
					onChange={(e) => setText(e.target.value)}
				></textarea>
				<button
					className="btn btn-primary col-sm-2 mt-4"
					onClick={posaljiKomentar}
				>
					Postavi komentar
				</button>
			</div>
		);
	};

	return (
		<div>
			<h3 style={{ textAlign: "center" }}>Komentari</h3>
			<hr />
			<div className="col-sm-12" style={{ textAlign: "center" }}>
				<button
					className="btn btn-outline-primary"
					onClick={(e) => {
						setShowForm(!showForm);
						if (!showForm) {
							e.target.innerText = "Zatvorite formu";
						} else {
							e.target.innerText = "Dodaj svoj komentar";
						}
					}}
				>
					Dodaj svoj komentar
				</button>
				{showForm && <DodajSvojKomentar />}
			</div>
			<hr />
			{komentari.map((komentar) => {
				return (
					<div
						key={komentar.email + komentar.date}
						className="komentar-profil"
						style={{}}
					>
						<div className="ms-3">
							<h5>{komentar.name}</h5>
							<h4 style={{ fontWeight: "600" }}>
								{komentar.text}
							</h4>
							<label style={{ color: "gray" }}>
								{prebaciVreme(komentar.date)}
							</label>
						</div>
						<hr />
					</div>
				);
			})}
			{komentari.length === 0 && (
				<h4 style={{ textAlign: "center" }}>Proizvod nema komentara</h4>
			)}
		</div>
	);
}

export default KomentariProfil;
