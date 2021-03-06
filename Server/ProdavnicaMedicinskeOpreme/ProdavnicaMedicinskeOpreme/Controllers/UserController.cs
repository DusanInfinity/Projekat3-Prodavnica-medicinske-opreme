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

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("GetUser/{email}")]
        public IActionResult GetUser(string email)
        {
            User user;
            try
            {
                user = _service.GetUser(email);

                if (user == null)
                    return BadRequest(new { message = $"Korisnik sa email-om {email} nije pronadjen!" });
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
        public IActionResult Login([FromBody] User data)
        {
            try
            {
                var token = _service.Authenticate(data.Email, data.Password);

                if (token == null)
                    return Unauthorized(new { message = "Niste uneli ispravne podatke za login!" });

                User user = _service.GetUser(data.Email);
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
