using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProdavnicaMedicinskeOpreme.Controllers
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

                //comments = await (await collectionComments.FindAsync(c => c.Product.Id == product._id)).ToListAsync();

                comments = await (from comment in collectionComments.AsQueryable<ProductComment>()
                                  where comment.Product.Id == product._id
                                  orderby comment.Date descending
                                  select comment).ToListAsync();
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            return Ok(comments);
        }

        [Authorize]
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
                comment.Date = DateTime.Now;
                await collectionComments.InsertOneAsync(comment);

                product.Comments.Add(new MongoDBRef("komentari", comment._id));
                var updateQuery = Builders<Product>.Update.Set("Comments", product.Comments);
                collectionProducts.UpdateOne(p => p._id == product._id, updateQuery);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom postavljanja komentara!" });
            }

            return Ok(comment);
        }
        [Authorize(Roles = "Admin")]
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
