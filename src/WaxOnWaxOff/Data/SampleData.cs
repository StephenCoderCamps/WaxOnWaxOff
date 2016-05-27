using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using WaxOnWaxOff.Data;
using WaxOnWaxOff.Models;

namespace WaxOnWaxOff.Data
{
    public class SampleData
    {


        public async static Task AddAdmins(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            var admins = config["admins"].Split(',');
            foreach (var email in admins)
            {
                var user = await userManager.FindByNameAsync(email);
                if (user == null)
                {
                    // create user
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email
                    };
                    var result = await userManager.CreateAsync(user, config["adminPassword"]);

                    // add claims
                    await userManager.AddClaimAsync(user, new Claim("IsAdmin", "true"));
                }
            }
        }

        public async static Task Initialize(IConfiguration config, IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ApplicationDbContext>();
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

            // add admins
            await AddAdmins(config, userManager);

            // add units
            if (!context.Units.Any())
            {
                context.Units.AddRange(
                        new Unit
                        {
                            Name = "JavaScript"
                        },
                        new Unit
                        {
                            Name = "ECMAScript"
                        }
                    );
                context.SaveChanges();
            }


            // add sample lessons
            if (!context.Lessons.Any())
            {

                // get units
                var javaScriptUnit = context.Units.First(u => u.Name == "JavaScript");
                var ecmaScriptUnit = context.Units.First(u => u.Name == "ECMAScript");


                context.Lessons.AddRange(
                    new Lesson
                    {
                        UnitId = javaScriptUnit.Id,
                        Title = "Lesson 01 - JavaScript Functions",
                        Labs = new List<Lab>
                        {
                            new Lab
                            {
                                LabType = LabType.TypeScript,
                                Title = "Lab 01 - TypeScript Add Numbers",
                                Instructions = "Using TypeScript, Create a function that adds two numbers.",
                                HTMLSolution = "",
                                TypeScriptSolution =  @"
                                    function addNumbers(a:number, b:number):number {
                                        return a + b;
                                    }
                                    ",
                                JavaScriptSolution = @"",
                                Test =@"
                                    describe('addNumbers', function () {
                                        it('should add positive numbers', function() {
                                            var result = addNumbers(1,3);
                                            expect(result).toBe(4);
                                        });
                                        it('should add negative numbers', function() {
                                            var result = addNumbers(-1,-3);
                                            expect(result).toBe(-4);
                                        });
                                    });
                                "
                            },

                            new Lab
                            {
                                LabType = LabType.JavaScript,
                                Title = "Lab 01 - Add Numbers",
                                Instructions = "Create a function that adds two numbers.",
                                HTMLSolution = "",
                                JavaScriptSolution = @"
                                    function addNumbers(a, b) {
                                        return a + b;
                                    }
                                ",
                                Test = @"
                                    describe('addNumbers', function () {
                                        it('should add positive numbers', function() {
                                            var result = addNumbers(1,3);
                                            expect(result).toBe(4);
                                        });
                                        it('should add negative numbers', function() {
                                            var result = addNumbers(-1,-3);
                                            expect(result).toBe(-4);
                                        });
                                    });
                                "

                            },
                            new Lab
                            {
                                LabType = LabType.JavaScript,
                                Title = "Lab 02 - Add Two DIV Elements",
                                Instructions = "Create a page with 2 DIV elements.",
                                HTMLSolution =  @"
                                    <html>
                                    <body>

                                        <div class='findMe' />
                                        <div class='findMe' />
                                    </body>
                                    </html>
                                ",
                                JavaScriptSolution = @"",
                                Test = @"
                                    describe('querySelectorAll', function () {
                                        it('should find 2 matches', function() {
                                            var matches = document.querySelectorAll('div');
                                            expect(matches.length).toBe(2);
                                        });
                                    });
                                "

                            },
                            new Lab
                            {
                                LabType = LabType.JavaScript,
                                Title = "Lab 03 - Validate Parameters",
                                Instructions = "Create a function that adds two numbers and throws an exception when a argument is not a number.",
                                HTMLSolution = "",
                                JavaScriptSolution =  @"
                                    function addNumbers(a, b) {
                                        if (typeof a != 'number') {
                                            throw new Error('a must be number.');
                                        }
                                        return a + b;
                                    }
                                ",
                                Test = @"
                                    describe('addNumbers', function () {
                                        it('should validate a parameter as number', function() {
                                            expect(function() {
                                                addNumbers('apple', 2);
                                            }).toThrowError('a must be number.');
                                        });
                                    });
                                "

                            }

                        },

                    },
                    new Lesson
                    {
                        UnitId = ecmaScriptUnit.Id,
                        Title = "Lesson 02 - TypeScript Classes",
                        Labs = new List<Lab>
                        {
                                                        new Lab
                            {
                                LabType = LabType.TypeScript,
                                Title = "Lab 01 - Create TypeScript Class",
                                Instructions = "Create a function that adds two numbers and throws an exception when a argument is not a number.",
                                HTMLSolution = "",
                                JavaScriptSolution =  @"",
                                TypeScriptSolution =  @"
                                    class Product {
                                        public doSomething() {
                                            return 'yikes';
                                        }
                                    }                
                                    ",
                                Test =  @"
                                    describe('Product class', function () {
                                        it('should return yikes', function() {
                                            let product = new Product();
                                            expect(product.doSomething()).toBe('yikes');
                                        });
                                    });
                                "
                            }


                        }
                    }
                );
                context.SaveChanges();
            }

        }

    }
}
