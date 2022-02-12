using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;
using ProdavnicaMedicinskeOpreme.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ProdavnicaMedicinskeOpreme.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingsController : ControllerBase
    {
        private static readonly Logging Log = new Logging("RatingsController");
        private readonly MongoClient _dbClient;
        private readonly UserService _service;
        public RatingsController(MongoClient client, UserService service)
        {
            _dbClient = client;
            _service = service;
        }

        [Authorize]
        [HttpPost]
        [Route("OceniProizvod/{productCode}/{rating}")]
        public IActionResult OceniProizvod(int productCode, byte rating)
        {
            bool successfulRate = false;
            Rate rate = null;
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionRatings = db.GetCollection<Rate>("ocene");

                var product = collectionProducts.Find(c => c.ProductCode == productCode).FirstOrDefault();
                if (product == null)
                    return BadRequest(new { message = $"Doslo je do greske, produkt nije pronadjen!" });

                User user = _service.GetUser(User.FindFirstValue(ClaimTypes.Email));
                if (user == null)
                    return BadRequest(new { message = $"Doslo je do greske, nalog nije pronadjen!" });

                rate = collectionRatings.Find(c => c.Product.Id == product._id && c.User.Id == user._id).FirstOrDefault();
                if (rate != null) // Azuriranje trenutne ocene
                {
                    rate.Rating = rating;
                    var updateQuery = Builders<Rate>.Update.Set("Rating", rate.Rating);
                    var result = collectionRatings.UpdateOne(u => u._id == rate._id, updateQuery);

                    successfulRate = result.IsAcknowledged && result.MatchedCount > 0;
                }
                else
                {
                    rate = new Rate()
                    {
                        Rating = rating,
                        Product = new MongoDBRef("produkti", product._id),
                        User = new MongoDBRef("korisnici", user._id)
                    };

                    collectionRatings.InsertOne(rate);

                    successfulRate = true;
                }
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            if (!successfulRate)
                return BadRequest(new { message = "Doslo je do greske prilikom ocenjivanja proizvoda!" });

            return Ok(rate);
        }

        [HttpGet] // ne koristimo authorize jer vracamo 0 ukoliko nije ulogovan
        [Route("VratiKorisnikovuOcenu/{productCode}")]
        public async Task<IActionResult> VratiKorisnikovuOcenu(int productCode)
        {
            try
            {
                if (!User.Identity.IsAuthenticated)
                    return Ok(0);

                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionRatings = db.GetCollection<Rate>("ocene");

                var product = await (await collectionProducts.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();
                if (product == null)
                    return BadRequest(new { message = $"Doslo je do greske, produkt nije pronadjen!" });

                User user = _service.GetUser(User.FindFirstValue(ClaimTypes.Email));
                if (user == null)
                    return BadRequest(new { message = $"Doslo je do greske, nalog nije pronadjen!" });

                Rate rate = await (await collectionRatings.FindAsync(c => c.Product.Id == product._id && c.User.Id == user._id)).FirstOrDefaultAsync();
                if (rate != null)
                    return Ok(rate.Rating);
                else
                    return Ok(0);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            return Ok(0);
        }

        [HttpGet]
        [Route("VratiBrojOcenaIProsek/{productCode}")]
        public async Task<IActionResult> VratiProsecnuOcenuIBrojOcena(int productCode)
        {
            Tuple<int, float> data = new Tuple<int, float>(0, 0);
            try
            {
                var db = _dbClient.GetDatabase("prodavnica");
                var collectionProducts = db.GetCollection<Product>("produkti");
                var collectionRatings = db.GetCollection<Rate>("ocene");

                var product = await (await collectionProducts.FindAsync(c => c.ProductCode == productCode)).FirstOrDefaultAsync();
                if (product == null)
                    return BadRequest(new { message = $"Doslo je do greske, produkt nije pronadjen!" });

                List<Rate> ratings = await (await collectionRatings.FindAsync(c => c.Product.Id == product._id)).ToListAsync();

                if (ratings.Count > 0)
                    data = new Tuple<int, float>(ratings.Count, (float)ratings.Sum(r => r.Rating) / ratings.Count);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
            }

            return Ok(data);
        }
    }
}
