using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MVC_CORE_test.Models;
using MVC_CORE_test.Services;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MVC_CORE_test.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MyTaskController : Controller
    {
        private readonly IMyTaskServices _myTaskService;

        public MyTaskController(IMyTaskServices myTaskService)
        {
            _myTaskService = myTaskService;
        }

        [HttpGet("MyTask")]
        public async Task<IActionResult> MyTasks()
        {

            var response = await _myTaskService.GetAllTasksAsync();

            return Ok(new { message = "Successful", data = response });
        }

        [HttpPost("CreateTask")]
        public async Task<IActionResult> CreateTask([FromBody] MyTaskModel myTaskModel)
        {

            MyTaskModelExeptions.Check(myTaskModel);

            var response = await _myTaskService.CreateMyTaskAsync(myTaskModel);

            return Ok(new { message = "Successful", data = response });
        }

        [HttpDelete("DeleteTask")]
        public async Task<IActionResult> DeleteTask([FromBody] MyTaskModel myTaskModel)
        {

            MyTaskModelExeptions.Check(myTaskModel);

            await _myTaskService.DeleteMyTaskAsync(myTaskModel);

            var data = await _myTaskService.GetAllTasksAsync();

            return Ok(new { message = "Successful", data = data });
        }

        [HttpPatch("EditTask")]
        public async Task<IActionResult> EditTask([FromBody] MyTaskEditModel myTaskEditModel)
        {
            MyTaskEditModelExeptions.Check(myTaskEditModel);

            await _myTaskService.EditMyTaskAsync(myTaskEditModel);

            var data = await _myTaskService.GetAllTasksAsync();

            return Ok(new { message = "Successful", data = data });
        }

        [HttpPost("AddSubTask")]
        public async Task<IActionResult> AddSubTask([FromBody] MyTaskEditModel myTaskEditModel)
        {
            MyTaskEditModelExeptions.Check(myTaskEditModel);

            await _myTaskService.AddSudTaskAsync(myTaskEditModel);

            var data = await _myTaskService.GetAllTasksAsync();

            return Ok(new { message = "Successful", data= data });
        }
    }
}

