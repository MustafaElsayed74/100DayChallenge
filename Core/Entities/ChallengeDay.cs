using System;
using Core.Enums;

namespace Core.Entities
{
    public class ChallengeDay : BaseEntity
    {
        public int ChallengeId { get; set; }
        public Challenge Challenge { get; set; }

        public int DayNumber { get; set; } // 1 to 100
        public DateTime Date { get; set; }
        public DayStatus Status { get; set; } = DayStatus.Pending;
        public DateTime? CompletedAt { get; set; }
        public string Note { get; set; }
    }
}
