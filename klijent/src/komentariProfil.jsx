import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./App.css";
import ApiClient from "./Global/apiClient";

function KomentariProfil({ productCode }) {
	const { id } = useParams();
	const api = new ApiClient();

	const data = sessionStorage.getItem("user");
	let user;
	if (data) {
		user = JSON.parse(data);
	}

	const [komentari, setKomentare] = useState([]);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		fetchComments();
	}, []);

	const fetchComments = async () => {
		try {
			const comments = await api.komentari.vratiKomentare(id);
			setKomentare(comments);
		} catch (e) {
			alert(`Greska ${e.message}`);
		}
	};

	const prebaciVreme = (vreme) => {
		//2021-06-02T16:44:08
		let vremeLista = vreme.toString().split("T");
		vremeLista[0] = vremeLista[0].split("-").reverse().join(".");
		return `${vremeLista[0]} ${vremeLista[1].split(".")[0]}`;
	};

	const DodajSvojKomentar = () => {
		const [text, setText] = useState("");

		const posaljiKomentar = async () => {
			const user = sessionStorage.getItem("user");
			if (user) {
				let data = JSON.parse(user);
				const comment = {
					name: `${data.firstname} ${data.lastname}`,
					email: data.email,
					text: text,
					date: new Date(),
				};
				try {
					api.setHeader("Content-Type", "application/json");
					await api.komentari.dodajKomentar(productCode, comment);
					window.location.reload();
				} catch (e) {
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
						className="komentar-profil pb-3 d-flex align-items-center justify-content-between"
						style={{ borderBottom: "1px solid lightgray" }}
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
						<div>
							{user && user.role === "Admin" && (
								<button
									className="btn me-5 p-3"
									style={{ fontSize: "1.5rem" }}
									onClick={() => {
										setKomentare(
											komentari.filter(
												(el) =>
													el.email !==
														komentar.email &&
													el.date !== komentar.date
											)
										);
										try {
											api.komentari.obrisiKomentar(
												id,
												komentar.name,
												komentar.date
											);
											alert("Uspesno obrisan komentar");
										} catch (e) {
											alert(e.message);
										}
									}}
								>
									<i className="bi bi-trash"></i>
								</button>
							)}
						</div>
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
