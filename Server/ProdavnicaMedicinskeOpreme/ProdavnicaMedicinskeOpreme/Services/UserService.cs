using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using ProdavnicaMedicinskeOpreme.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProdavnicaMedicinskeOpreme.Services
{
    public class UserService // Credits: https://medium.com/nerd-for-tech/net-jwt-authentication-with-mongodb-9bca4a33d3f0
    {
        private readonly IMongoCollection<User> users;

        public UserService(MongoClient _client)
        {
            var db = _client.GetDatabase("prodavnica");
            users = db.GetCollection<User>("korisnici");
        }

        public User GetUser(string email)
        {
            if (string.IsNullOrEmpty(email))
                return null;

            return users.Find<User>(u => u.Email == email).FirstOrDefault();
        }

        public User CreateUser(User user)
        {
            users.InsertOne(user);
            return user;
        }

        public string Authenticate(string email, string password)
        {
            User user = users.Find(u => u.Email == email && u.Password == password).FirstOrDefault();

            if (user == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();

            var tokenKey = Encoding.ASCII.GetBytes("!sMW_5su1VdPT@HsKe1d_VNg");
            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),

                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
