using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public ICollection<Challenge> Challenges { get; set; }
    }
}
