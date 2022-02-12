using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class User : CustomerData
    {
        public ObjectId _id { get; set; }
        public string Email { get; set; }
        public string Password { internal get; set; } // internal get sprecava serijalizaciju i slanje podataka klijentu
        public string Role { get; set; }
        public List<MongoDBRef> Orders { get; set; }
    }
}
