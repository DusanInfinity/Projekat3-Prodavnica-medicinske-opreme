using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProdavnicaMedicinskeOpreme.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase
    {
        private static readonly Logging Log = new Logging("ProductController");
        private readonly MongoClient _dbClient;

        public ProductController(MongoClient client)
        {
            _dbClient = client;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("VratiPodatkeProdukta/{productCode}")]
        public async Task<IActionResult> VratiPodatkeProdukta(int productCode)
        {
            Product product;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<Product>("produkti");

                product = await (await collection.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();
                if (product == null)
                    return BadRequest(new { message = "Produkt sa datim kodom nije pronadjen!" });
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex, $"ProductCode_{productCode}");
                return BadRequest(new { message = "Doslo je do greske prilikom pribavljanja podataka o produktu!" });
            }

            return Ok(product);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("VratiSveProdukte")]
        public async Task<IActionResult> VratiSveProdukte()
        {
            var products = new List<Product>();
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<Product>("produkti");

                products = await (await collection.FindAsync(_ => true)).ToListAsync();
            }
            catch
            {
                return BadRequest(new { message = "Doslo je do greske prilikom pribavljanja svih produkata!" });
            }

            return Ok(products);
        }

        [HttpPost]
        [Route("DodajProdukt")]
        public async Task<IActionResult> DodajProdukt([FromBody] Product newProduct)
        {
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<Product>("produkti");

                await collection.InsertOneAsync(newProduct);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom dodavanja produkta!" });
            }

            return Ok(newProduct);
        }

        [HttpPut]
        [Route("AzurirajProdukt")]
        public async Task<IActionResult> AzurirajProdukt([FromBody] Product newProduct)
        {
            bool successful = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<Product>("produkti");

                var updateQuery = Builders<Product>.Update.Set("Name", newProduct.Name)
                                                          .Set("Price", newProduct.Price)
                                                          .Set("Quantity", newProduct.Quantity)
                                                          .Set("Description", newProduct.Description)
                                                          .Set("Image", newProduct.Image)
                                                          .Set("Tags", BsonValue.Create(newProduct.Tags.ToList())); // ili samo newProduct.Tags

                var result = await collection.UpdateOneAsync(p => p.ProductCode == newProduct.ProductCode, updateQuery);

                successful = result.IsAcknowledged && result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            if (!successful)
                return BadRequest(new { message = "Doslo je do greske prilikom azuriranja produkta!" });

            return Ok(newProduct.ProductCode);
        }

        [HttpDelete]
        [Route("ObrisiProdukt/{productCode}")]
        public async Task<IActionResult> ObrisiProdukt(int productCode)
        {
            bool successful = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<Product>("produkti");

                var result = await collection.DeleteOneAsync(c => c.ProductCode == productCode);

                successful = result.IsAcknowledged && result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            if (!successful)
                return BadRequest(new { message = "Doslo je do greske prilikom brisanja produkta!" });

            return Ok(productCode);
        }

    }
}
