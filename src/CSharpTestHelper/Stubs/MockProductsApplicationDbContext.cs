using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpTestHelper.Stubs
{
    public class MockProductsApplicationDbContext
    {
        public IQueryable<Product> Products { get; set; }


        public MockProductsApplicationDbContext(params Product[] products)
        {
            if (products.Length > 0)
            {
                this.Products = products.AsQueryable<Product>();
            } else
            {
                this.Products = new List<Product>
                {
                    new Product {Id =1, Name="Cheese", Price=13.00m },
                    new Product {Id =2, Name="Bread", Price=2.00m },
                    new Product {Id =3, Name="Milk", Price=1.50m },
                    new Product {Id =4, Name="Oranges", Price=3.22m },
                    new Product {Id =5, Name="Apples", Price=4.55m },
                    new Product {Id =6, Name="Steak", Price=33.02m }
                }.AsQueryable<Product>();

            }
        }
    }
}
