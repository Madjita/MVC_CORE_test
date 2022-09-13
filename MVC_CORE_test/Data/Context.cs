using System;
using Microsoft.EntityFrameworkCore;
using MVC_CORE_test.Entities;

namespace MVC_CORE_test.Data
{
    public class Context : DbContext
    {
        public DbSet<MyTask> MyTask { get; set; }

        public Context(DbContextOptions<Context> options)
        : base(options)
        {
            //Database.EnsureDeleted();
            //Database.EnsureCreated();
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

           
           modelBuilder.Entity<MyTask>().HasData(
           new MyTask[]
           {
                new MyTask{Id=1,Name= "Task1"},
                new MyTask{Id=2,Name= "Task2"},
                new MyTask{Id=3,Name= "Task3"},
                new MyTask{Id=4,Name= "Task4"},
                new MyTask{Id=5,Name= "Task5"},
                new MyTask{Id=6,Name= "Task6"},
           });
        }

    }
}

