using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WaxOnWaxOff.Models;
using WaxOnWaxOff.Services;
using WaxOnWaxOff.Data;
using AutoMapper;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WaxOnWaxOff
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // add security policies
            services.AddAuthorization(options => {
                options.AddPolicy("AdminOnly", policy => policy.RequireClaim("IsAdmin"));
                options.AddPolicy("Student", policy => policy.RequireAssertion((authorizationContext) =>
                {
                    var authContext = authorizationContext.Resource as AuthorizationFilterContext;
                    var studentId = authContext.HttpContext.Request.Headers.Where(h => h.Key == "X-StudentId").Select(h => h.Value.FirstOrDefault()).FirstOrDefault();
                    var secret = authContext.HttpContext.Request.Headers.Where(h => h.Key == "X-Secret").Select(h => h.Value.FirstOrDefault()).FirstOrDefault();
                    if (String.IsNullOrWhiteSpace(studentId) || String.IsNullOrWhiteSpace(secret))
                    {
                        return false;
                    }
                    if (secret != Configuration["StudentSecret"])
                    {
                        return false;
                    }
                    return true;
                }));
            });

            


            // Add framework services.
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.AddMvc();


            // convert Pascal to Camel
            services.AddMvc().AddJsonOptions(options => {
                options.SerializerSettings.ContractResolver =
                    new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
            });

            // configure auto mapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AutoMapperProfile());
            });
            services.AddSingleton<IMapper>(sp => config.CreateMapper());
            services.AddScoped<LessonService>();
            services.AddScoped<LabService>();
            services.AddScoped<StudentService>();
            services.AddScoped<CSharpService>();




            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AutomaticChallenge = false
            });


            app.UseIdentity();

            // Add external authentication middleware below. To configure them please see http://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{*path}",
                    defaults: new { controller = "Home", action = "Index" }
                );
            });

            SampleData.Initialize(Configuration, app.ApplicationServices).Wait();
        }
    }
}
