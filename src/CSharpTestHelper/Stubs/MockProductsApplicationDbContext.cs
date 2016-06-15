using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpTestHelper.Stubs
{
    public class MockProductsApplicationDbContext
    {
        public IQueryable Products { get; set; }


        public MockProductsApplicationDbContext()
        {

        }
    }
}
