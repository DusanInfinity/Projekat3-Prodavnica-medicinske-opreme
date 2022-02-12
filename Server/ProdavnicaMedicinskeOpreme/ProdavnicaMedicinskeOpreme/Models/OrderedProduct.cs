using MongoDB.Driver;

namespace ProdavnicaMedicinskeOpreme.Models
{
    public class OrderedProduct
    {
        public int Quantity { get; set; }
        public MongoDBRef Product { get; set; }
    }
}
