using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class Rate
    {
        public ObjectId _id { get; set; }
        [JsonIgnore] public MongoDBRef Product { get; set; }
        [JsonIgnore] public MongoDBRef User { get; set; }
        public byte Rating { get; set; }
    }
}
