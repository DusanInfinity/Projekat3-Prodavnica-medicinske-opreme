using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;
using System;

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
        [Route("KupiProizvode/{userEmail}")]
        public IActionResult KupiProizvode(string userEmail, [FromBody] Order order)
        {
            bool successfulOrder = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionOrders = db.GetCollection<Order>("porudzbine");
                var collectionUsers = db.GetCollection<User>("korisnici");

                User user = null;
                if (!string.IsNullOrEmpty(userEmail))
                {
                    user = collectionUsers.Find(u => u.Email == userEmail).FirstOrDefault();

                    if (user == null)
                        return BadRequest(new { message = $"Doslo je do greske prilikom kupovine produkta sa Vaseg naloga, pokusajte kasnije!" });
                }

                foreach (OrderedProduct op in order.OrderedProducts)
                {
                    var product = collectionProducts.Find(c => c._id == op.Product.Id).FirstOrDefault();

                    if (product == null)
                        return BadRequest(new { message = $"Jedan od porucenih produkata nije pronadjen!" });

                    op.Product = new MongoDBRef("produkti", product._id);
                }

                collectionOrders.InsertOne(order);

                // Povezivanje porudzbine sa korisnikom ukoliko je u pitanju ulogovani korisnik
                if (user != null)
                {
                    user.Orders.Add(new MongoDBRef("porudzbine", order._id));
                    var updateQuery = Builders<User>.Update.Set("Orders", user.Orders);
                    collectionUsers.UpdateOne(u => u._id == user._id, updateQuery);
                }

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
