using System;
using System.Text.Json.Serialization;

namespace MVC_CORE_test.Entities
{
    public class BaseEntity
    {
        [JsonIgnore]
        public virtual int Id { get; set; }
    }
}

