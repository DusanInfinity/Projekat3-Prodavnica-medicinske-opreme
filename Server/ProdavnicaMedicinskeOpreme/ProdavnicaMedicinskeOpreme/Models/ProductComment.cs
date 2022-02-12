using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Text.Json.Serialization;

namespace WebShop.Models
{
    public class ProductComment
    {
        public ObjectId _id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        [JsonIgnore] public MongoDBRef Product { get; set; }
    }
}
