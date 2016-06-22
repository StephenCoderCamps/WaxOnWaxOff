using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WaxOnWaxOff.Data.Migrations
{
    public partial class PortalLessonId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PortalLessonId",
                table: "LessonScores",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PortalLessonId",
                table: "Lessons",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PortalLessonId",
                table: "LessonScores");

            migrationBuilder.DropColumn(
                name: "PortalLessonId",
                table: "Lessons");
        }
    }
}
