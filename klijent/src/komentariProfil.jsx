import React, { useState, useEffect } from "react";
import "./App.css";

function KomentariProfil({ productCode }) {
	const [komentari, setKomentare] = useState([]);

	useEffect(() => {
		fetchComments();
	}, []);

	const fetchComments = async () => {
		const comments = [
			{
				name: "Stefan",
				email: "stefan@gmail.com",
				text: "text komentara malo duzi",
				date: "2022-02-10T13:45:30",
			},
			{
				name: "Dusan",
				email: "dusan@gmail.com",
				text: "text komentara malo duzi malo duzi",
				date: "2022-02-09T13:45:30",
			},
		];

		setKomentare(comments);
	};

    const prebaciVreme = (vreme) => {
        //2021-06-02T16:44:08
        let vremeLista = vreme.toString().split("T");
        vremeLista[0] = vremeLista[0].split("-").reverse().join(".");
        return vremeLista[0]
    }

	return (
		<div>
			<h3 style={{ textAlign: "center" }}>Komentari</h3>
			<hr />
			{komentari.map((komentar) => {
				return (
					<div key={komentar.email}className="komentar-profil" style={{}}>
						<div className="ms-3">
							<h5>{komentar.name}</h5>
							<h4 style={{fontWeight: "600"}}>{komentar.text}</h4>
							<label style={{color: "gray"}}>{prebaciVreme(komentar.date)}</label>
						</div>
						<hr />
					</div>
				);
			})}
		</div>
	);
}

export default KomentariProfil;
