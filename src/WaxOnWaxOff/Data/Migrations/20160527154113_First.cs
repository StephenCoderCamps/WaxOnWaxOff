using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace WaxOnWaxOff.Data.Migrations
{
    public partial class First : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Units",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Units", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(nullable: false),
                    UnitId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Units_UnitId",
                        column: x => x.UnitId,
                        principalTable: "Units",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Labs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CSSSolution = table.Column<string>(nullable: true),
                    CSharpSolution = table.Column<string>(nullable: true),
                    HTMLSolution = table.Column<string>(nullable: true),
                    Instructions = table.Column<string>(nullable: false),
                    JavaScriptSolution = table.Column<string>(nullable: true),
                    LabType = table.Column<int>(nullable: false),
                    LessonId = table.Column<int>(nullable: false),
                    PlainSolution = table.Column<string>(nullable: true),
                    PreCSSSolution = table.Column<string>(nullable: true),
                    PreCSharpSolution = table.Column<string>(nullable: true),
                    PreHTMLSolution = table.Column<string>(nullable: true),
                    PreJavaScriptSolution = table.Column<string>(nullable: true),
                    PrePlainSolution = table.Column<string>(nullable: true),
                    PreTypeScriptSolution = table.Column<string>(nullable: true),
                    SetupScript = table.Column<string>(nullable: true),
                    Test = table.Column<string>(nullable: false),
                    Title = table.Column<string>(nullable: false),
                    TypeScriptSolution = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Labs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Labs_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LessonScores",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DatePassed = table.Column<DateTime>(nullable: false),
                    LessonId = table.Column<int>(nullable: false),
                    Passed = table.Column<bool>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LessonScores_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LessonScores_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Labs_LessonId",
                table: "Labs",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_UnitId",
                table: "Lessons",
                column: "UnitId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonScores_LessonId",
                table: "LessonScores",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonScores_UserId",
                table: "LessonScores",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Labs");

            migrationBuilder.DropTable(
                name: "LessonScores");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Units");
        }
    }
}
