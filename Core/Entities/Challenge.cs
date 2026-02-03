using System;
using System.Collections.Generic;

namespace Core.Entities
{
    public class Challenge : BaseEntity
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string Title { get; set; }
        public string GoalDescription { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }
        
        public ICollection<ChallengeDay> Days { get; set; }
    }
}
