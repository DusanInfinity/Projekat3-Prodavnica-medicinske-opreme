using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;

namespace ProdavnicaMedicinskeOpreme.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private static readonly Logging Log = new Logging("OrdersController");
        private readonly MongoClient _dbClient;
        public OrdersController(MongoClient client)
        {
            _dbClient = client;
        }

        [HttpPost]
        [Route("KupiProizvode")]
        public async Task<IActionResult> KupiProizvode([FromBody] Order order)
        {
            bool successfulOrder = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionOrders = db.GetCollection<Order>("porudzbine");

                foreach (OrderedProduct op in order.OrderedProducts)
                {
                    var product = await (await collectionProducts.FindAsync(c => c._id == op.Product.Id)).FirstOrDefaultAsync();

                    if (product == null)
                        return BadRequest(new { message = $"Jedan od porucenih produkata nije pronadjen!" });

                    op.Product = new MongoDBRef("produkti", product._id);
                }

                await collectionOrders.InsertOneAsync(order);
                successfulOrder = true;
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            if (!successfulOrder)
                return BadRequest(new { message = "Doslo je do greske prilikom narucivanja proizvoda!" });

            return Ok(order);
        }
    }
}
