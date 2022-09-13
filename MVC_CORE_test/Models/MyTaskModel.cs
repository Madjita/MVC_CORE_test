using System;
using System.Collections.Generic;

namespace MVC_CORE_test.Models
{
    public class BaseModel
    {
        public int Id { get; set; }
    }

    public class MyTaskModel : BaseModel
    {
        public string Name { get; set; }                            // Наименование задачи
        public string Descriptions { get; set; }                    // Описание задачи
        public string Users { get; set; }                           // Список исполнителей (простое текстовое поле, ссылочность не нужна)
        public DateTime DateTimeRegister { get; set; }              // Дата регистрации задачи в системе
        public int StatusTask { get; set; }                         // Статус задачи
        public int PlannedTime { get; set; }                        // Плановая трудоёмкость задачи
        public int FinishTime { get; set; }                         // Фактическое время выполнения
        public DateTime? DateTimeFinish { get; set; }                // Дата завершения

        public virtual List<MyTaskModel> MyTasks { get; set; }           // Список подзадач

        public MyTaskModel()
        {
            MyTasks = new List<MyTaskModel>();
        }
    }

    public class MyTaskEditModel
    {
        public MyTaskModel currentTask { get; set; }
        public MyTaskModel task { get; set; }
    }
}

