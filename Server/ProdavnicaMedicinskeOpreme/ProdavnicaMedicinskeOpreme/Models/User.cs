using MongoDB.Bson;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class User
    {
        public ObjectId _id { get; set; }
        public string Username { get; set; }
        public string Password { internal get; set; } // internal get sprecava serijalizaciju i slanje podataka klijentu
        public string Role { get; set; }
    }
}
