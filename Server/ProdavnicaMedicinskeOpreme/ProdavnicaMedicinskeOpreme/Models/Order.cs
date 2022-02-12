using MongoDB.Bson;
using System.Collections.Generic;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class Order
    {
        public ObjectId _id { get; set; }
        public CustomerData CustomerData { get; set; }
        public List<OrderedProduct> OrderedProducts { get; set; }
    }
}
