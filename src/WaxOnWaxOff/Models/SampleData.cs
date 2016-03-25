using System;
using System.Linq;
using Microsoft.Data.Entity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNet.Identity;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace WaxOnWaxOff.Models
{
    public class SampleData
    {
        public async static Task Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ApplicationDbContext>();
            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();
            context.Database.Migrate();

            // Ensure Stephen
            var user = await userManager.FindByNameAsync("Stephen.Walther@CoderCamps.com");
            if (user == null)
            {
                // create user
                user = new ApplicationUser
                {
                    UserName = "Stephen.Walther@CoderCamps.com",
                    Email = "Stephen.Walther@CoderCamps.com"
                };
                await userManager.CreateAsync(user, "Secret123!");

                // add claims
                await userManager.AddClaimAsync(user, new Claim("IsAdmin", "true"));
            }

            // add sample lessons
            if (!context.Lessons.Any())
            {
                context.Lessons.AddRange(
                    new Lesson
                    {
                        Title = "Lesson 01 - JavaScript Functions",
                        Labs = new List<Lab>
                        {
                            new Lab
                            {
                                Title = "01 - Add Numbers",
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
                                Title = "02 - Add Two DIV Elements",
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
                                Title = "03 - Validate Parameters",
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
                        Title = "Lesson 02 - TypeScript Classes"
                    }
                );
                context.SaveChanges();
            }

        }

    }
}
