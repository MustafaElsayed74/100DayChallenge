using System;

namespace Core.Entities
{
    public class ChallengeViewer : BaseEntity
    {
        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public DateTime AccessGrantedOn { get; set; } = DateTime.UtcNow;
    }
}
