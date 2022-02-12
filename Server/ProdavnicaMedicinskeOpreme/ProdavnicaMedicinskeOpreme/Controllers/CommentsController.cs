using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebShop.Data;
using WebShop.Models;

namespace WebShop.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentsController : ControllerBase
    {
        private static readonly Logging Log = new Logging("CommentsController");
        private readonly MongoClient _dbClient;
        public CommentsController(MongoClient client)
        {
            _dbClient = client;
        }


        [HttpGet]
        [Route("VratiKomentare/{productCode}")]
        public async Task<IActionResult> VratiKomentare(int productCode)
        {

            List<ProductComment> comments = new List<ProductComment>();
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionComments = db.GetCollection<ProductComment>("komentari");

                var product = await (await collectionProducts.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();

                if (product == null)
                    return BadRequest(new { message = "Produkt sa datim kodom nije pronadjen!" });

                comments = await (await collectionComments.FindAsync(c => c.Product.Id == product._id)).ToListAsync();
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            return Ok(comments);
        }


        [HttpPost]
        [Route("DodajKomentar/{productCode}")]
        public async Task<IActionResult> DodajKomentar(int productCode, [FromBody] ProductComment comment)
        {
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionComments = db.GetCollection<ProductComment>("komentari");

                var product = await (await collectionProducts.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();

                if (product == null)
                    return BadRequest(new { message = "Produkt sa datim kodom nije pronadjen!" });

                comment.Product = new MongoDBRef("produkti", product._id);
                await collectionComments.InsertOneAsync(comment);

                product.Comments.Add(new MongoDBRef("komentari", comment._id));
                await collectionProducts.ReplaceOneAsync(p => p._id == product._id, product); // u staroj verziji collection.Save(obj);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom postavljanja komentara!" });
            }

            return Ok(comment);
        }

        [HttpDelete]
        [Route("ObrisiKomentar/{productCode}/{name}/{date}")]
        public async Task<IActionResult> ObrisiKomentar(int productCode, string name, DateTime date)
        {
            bool successful = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionComments = db.GetCollection<ProductComment>("komentari");


                var product = await (await collectionProducts.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();

                if (product == null)
                    return BadRequest(new { message = "Produkt sa datim kodom nije pronadjen!" });

                var result = await collectionComments.DeleteOneAsync(c => c.Product.Id == product._id && c.Name == name && c.Date == date);

                successful = result.IsAcknowledged && result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            Log.WriteLine($"[Brisanje komentara] {productCode} {name} {date}");

            if (!successful)
                return BadRequest(new { message = "Doslo je do greske prilikom brisanja komentara!" });

            return Ok(productCode);
        }
    }
}
