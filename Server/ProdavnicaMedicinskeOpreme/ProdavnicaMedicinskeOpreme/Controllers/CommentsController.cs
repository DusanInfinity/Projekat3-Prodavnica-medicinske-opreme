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
                var collection = db.GetCollection<ProductComment>("komentari");

                comments = await (await collection.FindAsync(c => c.ProductCode == productCode)).ToListAsync();
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            return Ok(comments);
        }


        [HttpPost]
        [Route("DodajKomentar")]
        public async Task<IActionResult> DodajKomentar([FromBody] ProductComment comment)
        {
            bool successful = false;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collection = db.GetCollection<ProductComment>("komentari");

                ProductComment newComment = new ProductComment { ProductCode = comment.ProductCode, Name = comment.Name, Email = comment.Email, Text = comment.Text, Date = comment.Date };
                await collection.InsertOneAsync(comment);

                successful = true;
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            if (!successful)
                return BadRequest(new { message = "Doslo je do greske prilikom postavljanja komentara!" });

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
                var collection = db.GetCollection<ProductComment>("komentari");

                var result = await collection.DeleteOneAsync(c => c.ProductCode == productCode && c.Name == name && c.Date == date);

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
