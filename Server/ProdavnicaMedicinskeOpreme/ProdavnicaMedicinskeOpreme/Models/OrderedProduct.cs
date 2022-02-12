using MongoDB.Driver;

namespace WebShop.Models
{
    public class OrderedProduct
    {
        public int Quantity { get; set; }
        public MongoDBRef Product { get; set; }
    }
}
