using MongoDB.Bson;
using System.Collections.Generic;

namespace WebShop.Models
{
    public class Order
    {
        public ObjectId _id { get; set; }
        public Customer CustomerData { get; set; }
        public List<OrderedProduct> OrderedProducts { get; set; }
    }
}
