using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MVC_CORE_test.Data;
using MVC_CORE_test.Entities;
using MVC_CORE_test.Models;
using static MVC_CORE_test.Entities.MyTask;

namespace MVC_CORE_test.Services
{
    public interface IMyTaskServices
    {
        Task<object> CreateMyTaskAsync(MyTaskModel myTaskModel);
        Task<object> DeleteMyTaskAsync(MyTaskModel myTaskModel);
        Task<object> EditMyTaskAsync(MyTaskEditModel myTaskModel);

        Task<object> AddSudTaskAsync(MyTaskEditModel myTaskModel);

        Task<List<MyTask>> GetAllTasksAsync();
    }

    public class MyTaskServices : IMyTaskServices
    {
        private readonly IEfRepository<MyTask> _myTaskRepository;

        public MyTaskServices(
            IEfRepository<MyTask> myTaskRepository
        )
        {
            _myTaskRepository = myTaskRepository;
        }

        private bool CanConnect()
        {

            try
            {
                if (!(_myTaskRepository.GetContext().Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator).Exists())
                {
                    return false;
                }
            }
            catch(Exception e)
            {
                
                throw new Exception("Can't connect to database.");
            }

            return true;
        }

        private void recursionChangeStatus(MyTask subTasks, Status status)
        {
            if (subTasks.MyTasks.Count > 0)
            {
                foreach (var item in subTasks.MyTasks)
                {
                    recursionChangeStatus(item, status);
                }
            }

            subTasks.StatusTask = status;
        }

        private void checkStatus(MyTask task, MyTask.Status status)
        {

            if (task.StatusTask == Status.Appointed && status == Status.Done)
            {
                //Выходим так как перевести из статуса Appointed в Done мы не можем
                throw new CantChangeStatusCode($"Unfortunately, we cann't change Task status = \"{task.Name}\", because SubTasks didn't finish.");
            }

            if (status == Status.Done)
            {
                //Код для работы со статусом задачи
                if (task.MyTasks.Count > 0) // проверка существуют ли подзадачи у найше задачи
                {

                    //Поиск статусов которые не могу перевести в Done
                    var findAppointedStatus = task.MyTasks.Where(x => x.StatusTask == Status.Appointed).ToList();

                    if (findAppointedStatus.Count > 0)
                    {
                        //Выходим так как перевести из статуса Appointed в Done мы не можем
                        throw new CantChangeStatusCode($"Unfortunately, we cann't change Task status = \"{task.Name}\", because SubTasks didn't finish.");
                    }
                    else
                    {
                        //Поменять статсу для вложенности
                        recursionChangeStatus(task, status);
                    }
                }
            }

            task.StatusTask = status;

            //Поменять статсу для вложенности
            recursionChangeStatus(task, status);

        }

        private async Task checkStatusParentAsync(MyTask task, MyTask.Status status)
        {
            CanConnect();

            if (task.MyTaskId == null)
            {
                return;
            }
            //Поиск родителя чтоб проверить нужно ли переводить его статус
            //Найти парента
            var taskParent = await _myTaskRepository
                .Get()
                .Where(x => x.Id == task.MyTaskId)
                .FirstOrDefaultAsync();


            bool flagChange = false;

            if (taskParent.MyTasks.Count == 1)
            {
                var item = taskParent.MyTasks.First();

                taskParent.StatusTask = status;
                flagChange = true;
            }
            else
            {
                var countStatuc = 0;
                //првоерить его статусы
                foreach (var item in taskParent.MyTasks)
                {
                    if (item.StatusTask == Status.Appointed)
                    {
                        taskParent.StatusTask = Status.Appointed;
                        flagChange = true;
                        break;
                    }
                    else
                    {
                        if (item.StatusTask == status)
                        {
                            countStatuc++;
                        }
                    }
                }

                if (countStatuc == taskParent.MyTasks.Count)
                {
                    taskParent.StatusTask = status;
                    flagChange = true;
                }
            }



            if (flagChange)
            {
                if (taskParent.StatusTask == MyTask.Status.Done)
                {
                    taskParent.DateTimeFinish = DateTime.UtcNow;

                    TimeSpan test = (TimeSpan)(taskParent.DateTimeFinish - taskParent.DateTimeRegister);

                    taskParent.FinishTime = (int)test.TotalMinutes;
                }

                await _myTaskRepository.Update(taskParent);
            }

            await checkStatusParentAsync(taskParent, status);

        }

        public async Task<object> AddSudTaskAsync(MyTaskEditModel myTaskEditModel)
        {
            CanConnect();

            var task = await _myTaskRepository
                         .Get()
                         .Where(x => x.Name == myTaskEditModel.currentTask.Name)
                         .FirstOrDefaultAsync();

            var subTask = await _myTaskRepository
                          .Get()
                          .Where(x => x.Name == myTaskEditModel.task.Name)
                          .FirstOrDefaultAsync();

            //Выбранная задача сушествует
            if (task != null)
            {
                //Добавляем задачу
                if(subTask != null && subTask.Id != task.Id)
                {
                    if(subTask.MyTaskId == null )
                    {
                        task.MyTasks.Add(subTask);

                        _ = await _myTaskRepository.Save();

                        return subTask;
                    }
                    else
                    {
                        subTask.MyTaskId = task.Id;
                        _ = await _myTaskRepository.Save();
                        return subTask;
                    }
                }
                else
                {
                    //Создаем задачу
                    //createTask(task, myTaskModel);

                    throw new FoundTheSameItem_InDatabase_HowInRequest($"Unfortunately, we didn't find  subTask = \"{myTaskEditModel.task.Name}\" the same item in Database! Item didn't add on subTask.");
                }
            }

            throw new FoundTheSameItem_InDatabase_HowInRequest($"Unfortunately, we didn't find  currentTask = \"{myTaskEditModel.currentTask.Name}\" the same item in Database! Item didn't add on subTask.");
        }

        public async Task<object> CreateMyTaskAsync(MyTaskModel myTaskModel)
        {
            CanConnect();

            var task = await _myTaskRepository
                .Get()
                .Where(x=> x.Name == myTaskModel.Name)
                .FirstOrDefaultAsync();

            if(task == null)
            {

                //Создаем Задачу
                task = new MyTask();

                if (myTaskModel.StatusTask <= 0)
                {
                    task.StatusTask = MyTask.Status.Appointed;
                }
                else
                {
                    var status = (MyTask.Status)myTaskModel.StatusTask;
                    checkStatus(task, status);

                    task.StatusTask = status;
                }


                task.Name = myTaskModel.Name;
                task.Descriptions = myTaskModel.Descriptions;
                task.Users = myTaskModel.Users;
                task.PlannedTime = myTaskModel.PlannedTime;
                task.FinishTime = myTaskModel.FinishTime;

                task.DateTimeRegister = DateTime.UtcNow;

                _ = await _myTaskRepository.Add(task);

                if (myTaskModel.MyTasks.Count > 0)
                {
                    foreach(var item in myTaskModel.MyTasks)
                    {
                        await CreateMyTaskAsync(item);
                    }
                }                

                return await Task.FromResult(new
                {
                    Name = task.Name,
                    Descriptions = task.Descriptions,
                    StatusTask = (int)task.StatusTask,
                    Users = task.Users,
                    PlannedTime = task.PlannedTime,
                    FinishTime = task.FinishTime,
                    DateTimeRegister = task.DateTimeRegister,
                    MyTasks = task.MyTasks
                }) ;
            }

            throw new FoundTheSameItem_InDatabase_HowInRequest("Unfortunately, we found the same item in Database! Item didn't create.");
        }

        public async Task<object> DeleteMyTaskAsync(MyTaskModel myTaskModel)
        {
            CanConnect();

            MyTask task = null;

            if (myTaskModel.Id > 0 )
            {
              task = await _myTaskRepository
                  .Get()
                  .Where(x => x.Id == myTaskModel.Id)
                  .FirstOrDefaultAsync();
            }
            else
            {
                task = await _myTaskRepository
                 .Get()
                 .Where(x => x.Name == myTaskModel.Name)
                 .FirstOrDefaultAsync();
            }

            if(task != null)
            {

                foreach (var item in task.MyTasks)
                {
                    item.MyTaskId = task.MyTaskId;
                }

                var removeTask = await _myTaskRepository.Remove(task);
                return task;
            }

            throw new FoundTheSameItem_InDatabase_HowInRequest("Unfortunately, we didn't find the same item in Database! Item didn't delete.");
        }

        public async Task<object> EditMyTaskAsync(MyTaskEditModel myTaskModel)
        {
            CanConnect();

            MyTask task = null;

            if (myTaskModel.currentTask.Id > 0)
            {
                task = await _myTaskRepository
                    .Get()
                    .Where(x => x.Id == myTaskModel.currentTask.Id)
                    .FirstOrDefaultAsync();
            }
            else
            {
                task = await _myTaskRepository
                 .Get()
                 .Where(x => x.Name == myTaskModel.currentTask.Name)
                 .FirstOrDefaultAsync();
            }


            if (task != null)
            {
                var status = (MyTask.Status)myTaskModel.task.StatusTask;

                checkStatus(task, status);

                task.Name = myTaskModel.task.Name;
                task.Descriptions = myTaskModel.task.Descriptions;
                task.Users = myTaskModel.task.Users;
                task.PlannedTime = myTaskModel.task.PlannedTime;


                if (status == MyTask.Status.Done)
                {
                    task.DateTimeFinish = DateTime.UtcNow;

                    TimeSpan test = (TimeSpan)(task.DateTimeFinish - task.DateTimeRegister);

                    task.FinishTime = (int)test.TotalHours;

                }
                else
                {
                    task.DateTimeFinish = null;
                }    
                
                _ = await _myTaskRepository.Update(task);


                await checkStatusParentAsync(task, status);

                return task;
            }

           
            throw new FoundTheSameItem_InDatabase_HowInRequest("Unfortunately, we didn't find the same item in Database! Item didn't edit.");
        }

        public async Task<List<MyTask>> GetAllTasksAsync()
        {
            CanConnect();

            _myTaskRepository.ClearCash();

            var tasks = await _myTaskRepository.Get()
                .Where(x => x.MyTaskId == null)
                .ToListAsync();


            return tasks;
        }

    }
}

