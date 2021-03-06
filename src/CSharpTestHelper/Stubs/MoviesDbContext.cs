﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CSharpTestHelper.Stubs
{
    public class MoviesDbContext: DbContext
    {
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<MovieActor> MovieActors { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<MovieActor>().HasKey(x => new { x.MovieId, x.ActorId });
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public MoviesDbContext(DbContextOptions<MoviesDbContext> options)
            : base(options)
        { }
    }



    public class Genre
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Movie> Movies { get; set; }

        public Genre()
        {
            this.Movies = new List<Movie>();
        }
    }

    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Rating { get; set; }

        public int GenreId { get; set; }
        public Genre Genre { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }

        public Movie()
        {
            this.MovieActors = new List<MovieActor>();
        }
    }


    public class MovieActor
    {
        public int MovieId { get; set; }
        public Movie Movie { get; set; }
        public int ActorId { get; set; }
        public Actor Actor { get; set; }
    } 

    public class Actor
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }

        public Actor()
        {
            this.MovieActors = new List<MovieActor>();
        }
    }


}
