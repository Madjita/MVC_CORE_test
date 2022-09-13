using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MVC_CORE_test.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MyTask",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Descriptions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Users = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DateTimeRegister = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StatusTask = table.Column<int>(type: "int", nullable: false),
                    PlannedTime = table.Column<int>(type: "int", nullable: false),
                    FinishTime = table.Column<int>(type: "int", nullable: true),
                    DateTimeFinish = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MyTaskId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MyTask", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MyTask_MyTask_MyTaskId",
                        column: x => x.MyTaskId,
                        principalTable: "MyTask",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "MyTask",
                columns: new[] { "Id", "DateTimeFinish", "DateTimeRegister", "Descriptions", "FinishTime", "MyTaskId", "Name", "PlannedTime", "StatusTask", "Users" },
                values: new object[,]
                {
                    { 1, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task1", 0, 0, null },
                    { 2, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task2", 0, 0, null },
                    { 3, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task3", 0, 0, null },
                    { 4, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task4", 0, 0, null },
                    { 5, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task5", 0, 0, null },
                    { 6, null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, null, "Task6", 0, 0, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MyTask_MyTaskId",
                table: "MyTask",
                column: "MyTaskId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MyTask");
        }
    }
}
