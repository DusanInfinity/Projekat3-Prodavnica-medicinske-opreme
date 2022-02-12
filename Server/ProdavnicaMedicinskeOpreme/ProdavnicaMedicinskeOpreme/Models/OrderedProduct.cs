using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System.Text.Json.Serialization;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class OrderedProduct
    {
        public int Quantity { get; set; }
        [BsonIgnore] public int ProductCode { get; set; }
        [JsonIgnore] public MongoDBRef Product { get; set; }
    }
}
