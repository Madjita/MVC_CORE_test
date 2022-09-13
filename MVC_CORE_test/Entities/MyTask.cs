using System;
using System.Collections.Generic;
using System.Linq;

namespace MVC_CORE_test.Entities
{
    public class MyTask : BaseEntity
    {

        public enum Status
        {
            Appointed,      // Назначена
            Execute,        // Выполняется
            Pause,          // Приостановлена
            Done,           // Завершена

        }   // Статус задачи: Назначена, Выполняется, Приостановлена, Завершена(число статусов для
            // системы фиксировано и сами статусы неизменны).

        public string Name { get; set; }                            // Наименование задачи
        public string Descriptions { get; set; }                    // Описание задачи
        public string Users { get; set; }                           // Список исполнителей (простое текстовое поле, ссылочность не нужна)
        public DateTime DateTimeRegister { get; set; }              // Дата регистрации задачи в системе
        public Status StatusTask { get; set; }                      // Статус задачи

        private int _plannedTime;
        public int PlannedTime
        {
            get
            {
                var result = 0;
                if (MyTasks.Count > 0)
                {
                    result = MyTasks
                        .GroupBy(x => x.Id)
                        .Select(n => n.Sum(m => m.PlannedTime)).Sum();
                }
                else
                {
                    result = _plannedTime;
                }

                return result;
            }
            set => _plannedTime = value;
        }                                                           // Плановая трудоёмкость задачи
        private int _finishTime;
        public int? FinishTime { get
            {
                var result = 0;
                if (MyTasks.Count > 0)
                {
                    result = (int)MyTasks
                        .Where(x => x.StatusTask == Status.Done)
                        .GroupBy(x => x.Id)
                        .Select(n => n.Sum(m => m.FinishTime))
                        .Sum();
                }
                else
                {
                    result = _finishTime;
                }

                return result;
            }
            set => _finishTime = (int)value;

        }                        // Фактическое время выполнения
        public DateTime? DateTimeFinish { get; set; }               // Дата завершения

        public int? MyTaskId { get; set; }
        public virtual ICollection<MyTask>? MyTasks { get; set; }           // Список подзадач

        public MyTask()
        {
            MyTasks = new List<MyTask>();
        }
    }
}

