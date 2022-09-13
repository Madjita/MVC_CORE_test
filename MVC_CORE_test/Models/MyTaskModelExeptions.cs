using System;
namespace MVC_CORE_test.Models
{
    public class MyTaskEditModelExeptions : Exception
    {
        public MyTaskEditModelExeptions(string message)
            : base(message)
        {

        }

        public static void Check(MyTaskEditModel myTaskModel)
        {
            if (myTaskModel == null)
            {
                throw new MyTaskEditModelExeptions("Request model is empty, because \"MyTaskEditModel\" is empty");
            }

            if (myTaskModel.currentTask == null || myTaskModel.currentTask.Name == "")
            {
                throw new MyTaskEditModelExeptions("Request model is empty, because \"MyTaskEditModel.currentTask\" is empty");
            }

            if (myTaskModel.task == null || myTaskModel.task.Name == "")
            {
                throw new MyTaskEditModelExeptions("Request model is empty, because \"MyTaskEditModel.task\" is empty");
            }
        }
    }

   

    public class MyTaskModelExeptions : Exception
    {
        public MyTaskModelExeptions(string message)
            : base(message)
        {

        }

        public static void Check(MyTaskModel myTaskModel)
        {
            if (myTaskModel == null)
            {
                throw new MyTaskModelExeptions("Request model is empty, because \"MyTaskModel\" is empty");
            }

            if (myTaskModel.Name == null || myTaskModel.Name == "")
            {
                throw new MyTaskModelExeptions("Request model is empty, because \"MyTaskModel.Name\" is empty");
            }
        }
    }

    public class FoundTheSameItem_InDatabase_HowInRequest : Exception
    {
        public FoundTheSameItem_InDatabase_HowInRequest(string message)
                   : base(message)
        {

        }
    }

    public class CantChangeStatusCode : Exception
    {
        public CantChangeStatusCode(string message)
                   : base(message)
        {

        }
    }

}