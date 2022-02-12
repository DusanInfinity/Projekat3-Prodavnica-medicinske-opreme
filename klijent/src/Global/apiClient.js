import { authHeader } from "./functions.js";
import { HttpClient } from "./httpClient.js";

class ApiClient extends HttpClient {
  constructor(hdrs = authHeader()) {
    super({
      baseURL: 'https://localhost:46232/',
      headers: hdrs
    });
  }

  get produkti() {
    return {
      vratiPodatkeProdukta: (productCode) => this.get(`Product/VratiPodatkeProdukta/${productCode}`),
      vratiSveProdukte: () => this.get(`Product/VratiSveProdukte`),

      dodajProdukt: (product) => this.post(`Product/DodajProdukt`, product),
      azurirajProdukt: (product) => this.put(`Product/AzurirajProdukt`, product),
      obrisiProdukt: (productCode) => this.delete(`Product/ObrisiProdukt/${productCode}`),
    };
  }

  get komentari() {
    return {
      vratiKomentare: (productCode) => this.get(`Comments/VratiKomentare/${productCode}`),

      dodajKomentar: (productCode, comment) => this.post(`Comments/DodajKomentar/${productCode}`, comment),
      obrisiKomentar: (productCode, name, date) => this.delete(`Comments/ObrisiKomentar/${productCode}/${name}/${date}`),
    };
  }
  get porudzbine() {
    return {
      kupiProizvode: (order) => this.post(`Orders/KupiProizvode`, order),
    }
  }

  get korisnik() {
    return {
      registrujSe: (user) => this.post(`User/RegisterUser`, user),
      ulogujSe: (user) => this.post(`User/Login`, user),
    }
  }

  get ocene() {
    return {
      oceniProizvod: (productCode, rating) => this.post(`Ratings/OceniProizvod/${productCode}/${rating}`),
      vratiKorisnikovuOcenu: (productCode) => this.get(`Ratings/VratiKorisnikovuOcenu/${productCode}`),
      vratiBrojOcenaIProsek: (productCode) => this.get(`Ratings/VratiBrojOcenaIProsek/${productCode}`),
    }
  }

}

export default ApiClient;