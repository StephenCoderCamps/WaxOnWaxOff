using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using System.Diagnostics;
using CSharpTestHelper.Stubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace CSharpTestHelper
{
    // This project can output the Class library as a NuGet Package.
    // To enable this option, right-click on the project and select the Properties menu item. In the Build tab select "Produce outputs on build".
    public class Helper
    {
        public readonly Assert Assert = new CSharpTestHelper.Assert();
        public readonly Verify Verify = new Verify();
        public readonly Dump Dump = new Dump();


        public MockProductsApplicationDbContext GetProductsApplicationDbContext(params Product[] products)
        {
            return new MockProductsApplicationDbContext(products);
        }


        private static DbContextOptions<MoviesDbContext> CreateNewContextOptions()
        {
            // Create a fresh service provider, and therefore a fresh 
            // InMemory database instance.
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            // Create a new options instance telling the context to use an
            // InMemory database and the new service provider.
            var builder = new DbContextOptionsBuilder<MoviesDbContext>();
            builder.UseInMemoryDatabase()
                   .UseInternalServiceProvider(serviceProvider);

            return builder.Options;
        }


        public MoviesDbContext GetMoviesApplicationDbContext()
        {
            var options = CreateNewContextOptions();
            var db = new MoviesDbContext(options);

            // add actors
            var actors = new Dictionary<string, Actor>
            {
                {"Harrison Ford", new Actor { FirstName="Harrison", LastName="Ford" } },
                {"Al Pacino", new Actor { FirstName="Al", LastName="Pacino" } },
                {"Alicia Vikander", new Actor { FirstName="Alicia", LastName="Vikander" } },
                {"Mark Hamill", new Actor { FirstName="Mark", LastName="Hamill" } }
            };
            db.Actors.AddRange(actors["Harrison Ford"], actors["Al Pacino"]);
            db.SaveChanges();

            // add genres/movies
            var movies = new Dictionary<string, Movie>
            {
                { "Star Wars", new Movie {Title="Star Wars", Rating=5 } },
                { "Ex Machina", new Movie {Title="Ex Machina", Rating=4 } },
                { "Blade Runner", new Movie {Title="Blade Runner", Rating=3 } },
                { "Regarding Henry", new Movie {Title="Regarding Henry", Rating=2 } },
                { "The Godfather", new Movie {Title="The Godfather", Rating=5 } }

            };
            db.Genres.AddRange(
                new Genre
                {
                    Name = "Science Fiction",
                    Movies = new Movie[] {
                        movies["Star Wars"],
                        movies["Ex Machina"],
                        movies["Blade Runner"]
                    }
                },
                 new Genre
                 {
                     Name = "Drama",
                     Movies = new Movie[] {
                        movies["Regarding Henry"],
                        movies["The Godfather"],
                    }
                 }

            );
            db.SaveChanges();

            // add many-to-many for movies => actors
            db.MovieActors.AddRange(
                new MovieActor {Movie = movies["Blade Runner"], Actor=actors["Harrison Ford"] },
                new MovieActor {Movie = movies["Regarding Henry"], Actor = actors["Harrison Ford"] },
                new MovieActor { Movie = movies["Star Wars"], Actor = actors["Harrison Ford"] },
                new MovieActor { Movie = movies["Star Wars"], Actor = actors["Mark Hamill"] },
                new MovieActor { Movie = movies["The Godfather"], Actor = actors["Al Pacino"] },
                new MovieActor { Movie = movies["Ex Machina"], Actor = actors["Alicia Vikander"] }
            );
            db.SaveChanges();

            return db;
        }



        public object InvokeMethod(Type classType, string methodName, params object[] parameters)
        {
            // Create instance of class
            var instance = Activator.CreateInstance(classType);
            
            // get method
            var method = classType.GetTypeInfo().GetMethod(methodName);
            if (method == null)
            {
                throw new TestResult(methodName + " method does not exist!");
            }

            // invoke it
            return method.Invoke(instance, parameters);
        }

        //public object GetPropertyValue<T>(string propertyName)
        //{
        //    // create instance of class
        //    var instance = Activator.CreateInstance(typeof(T));

        //    // get property
        //    var property = typeof(T).GetTypeInfo().GetProperty(propertyName);
        //    if (property == null)
        //    {
        //        throw new TestResult(propertyName + " property does not exist!");
        //    }

        //    // invoke it
        //    return property.GetValue(instance);
        //}

        //public void SetPropertyValue<T>(string propertyName, object value)
        //{
        //    // create instance of class
        //    var instance = Activator.CreateInstance(typeof(T));

        //    // get property
        //    var property = typeof(T).GetTypeInfo().GetProperty(propertyName);
        //    if (property == null)
        //    {
        //        throw new TestResult(propertyName + " property does not exist!");
        //    }

        //    // set it
        //    property.SetValue(instance, value);
        //}


        //public IEnumerable<PropertyInfo> GetProperties<T>()
        //{
        //    var type = typeof(T);
        //    return type.GetRuntimeProperties();
        //}


        //public ISymbol GetSymbol(string symbolName)
        //{
        //    var result =  _compilation.GetSymbolsWithName(s => s == symbolName).FirstOrDefault();
        //    return result;
        //}


    }
}
