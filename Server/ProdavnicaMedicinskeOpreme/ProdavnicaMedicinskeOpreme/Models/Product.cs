using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebShop.Models
{
    public class Product
    {
        public ObjectId _id { get; set; }
        public int ProductCode { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public List<string> Tags { get; set; }
        public string Category { get; set; }
        [JsonIgnore] public List<MongoDBRef> Comments { get; set; }

        public void InformFollowersAboutQuantity(int quantity, List<string> emails)
        {
            // TO-DO slanje emailova svim klijentima o dostupnosti proizvoda
        }
    }
}
