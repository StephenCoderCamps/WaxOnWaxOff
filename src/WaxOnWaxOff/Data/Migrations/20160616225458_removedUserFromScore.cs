using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WaxOnWaxOff.Data.Migrations
{
    public partial class removedUserFromScore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonScores_AspNetUsers_UserId",
                table: "LessonScores");

            migrationBuilder.DropIndex(
                name: "IX_LessonScores_UserId",
                table: "LessonScores");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "LessonScores");

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "LessonScores",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "LessonScores");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "LessonScores",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_LessonScores_UserId",
                table: "LessonScores",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonScores_AspNetUsers_UserId",
                table: "LessonScores",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
