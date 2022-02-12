using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProdavnicaMedicinskeOpreme.Data;
using ProdavnicaMedicinskeOpreme.Models;
using ProdavnicaMedicinskeOpreme.Services;
using System;

namespace ProdavnicaMedicinskeOpreme.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private static readonly Logging Log = new Logging("UserController");
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("GetUser/{username}")]
        public IActionResult GetUser(string username)
        {
            User user;
            try
            {
                user = _service.GetUser(username);

                if (user == null)
                    return BadRequest(new { message = $"Korisnik sa username-om {username} nije pronadjen!" });
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom pribavljanja podataka korisnika!" });
            }
            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("RegisterUser")]
        public IActionResult RegisterUser([FromBody] User user)
        {
            try
            {
                user.Role = "Korisnik"; // hardkodirano jer nece biti izbora za uloge prilikom registracije
                _service.CreateUser(user);
                return Ok(user);
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom registrovanja korisnika!" });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public IActionResult Login([FromBody] User user)
        {
            try
            {
                var token = _service.Authenticate(user.Username, user.Password);

                if (token == null)
                    return Unauthorized(new { message = "Niste uneli ispravne podatke za login!" });

                return Ok(new { token, user });
            }
            catch (Exception ex)
            {
                Log.ExceptionTrace(ex);
                return BadRequest(new { message = "Doslo je do greske prilikom autorizacije korisnika!" });
            }
        }
    }
}
