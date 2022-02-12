using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using ProdavnicaMedicinskeOpreme.Services;
using System.Text;

namespace ProdavnicaMedicinskeOpreme
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ProdavnicaMedicinskeOpreme", Version = "v1" });
            });

            services.AddSingleton(new MongoClient("mongodb://localhost/?safe=true"));
            services.AddScoped<UserService>();

            services.AddCors(p =>
            {
                p.AddPolicy("CORS", builder =>
                {
                    builder.AllowAnyHeader()
                           .AllowAnyMethod()
                           .WithOrigins("https://localhost:5001",
                                        "http://127.0.0.1:8080",
                                        "http://localhost:5500",
                                        "http://192.168.0.105:5500").AllowAnyOrigin();
                });
            });

            services.AddAuthentication(a =>
            {
                a.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(a =>
            {
                a.RequireHttpsMetadata = false;
                a.SaveToken = true;
                a.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("!sMW_5su1VdPT@HsKe1d_VNg")),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProdavnicaMedicinskeOpreme v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CORS");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
