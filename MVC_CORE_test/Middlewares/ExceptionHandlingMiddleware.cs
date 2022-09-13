using System;
using System.Net;
using MVC_CORE_test.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MVC_CORE_test.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch(MyTaskEditModelExeptions ex)
            {
                await HandleExceptionAsync(httpContext,
                  ex.Message,
                  HttpStatusCode.ExpectationFailed,
                  "Request model is empty");
            }
            catch(MyTaskModelExeptions ex)
            {
                await HandleExceptionAsync(httpContext,
                   ex.Message,
                   HttpStatusCode.ExpectationFailed,
                   "Request model is empty");
            }
            catch(FoundTheSameItem_InDatabase_HowInRequest ex)
            {
                await HandleExceptionAsync(httpContext,
                   ex.Message,
                   HttpStatusCode.ExpectationFailed,
                   ex.Message);
            }
            catch(CantChangeStatusCode ex)
            {
                await HandleExceptionAsync(httpContext,
                  ex.Message,
                  HttpStatusCode.ExpectationFailed,
                  ex.Message);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext,
                    ex.Message,
                    HttpStatusCode.InternalServerError,
                    "Internal server error");
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, string exMsg, HttpStatusCode httpStatusCode, string message)
        {
            _logger.LogError(exMsg);

            HttpResponse response = context.Response;

            response.ContentType = "application/json";
            response.StatusCode = (int)httpStatusCode;

            ErrorDto errorDto = new()
            {
                Message = message,
                StatusCode = (int)httpStatusCode
            };

            await response.WriteAsJsonAsync(errorDto);
        }
    }
}
