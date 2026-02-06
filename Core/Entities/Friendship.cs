using System;

namespace Core.Entities
{
    public class Friendship : BaseEntity
    {
        public string RequesterId { get; set; }
        public ApplicationUser Requester { get; set; }

        public string AddresseeId { get; set; }
        public ApplicationUser Addressee { get; set; }

        public FriendshipStatus Status { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }

    public enum FriendshipStatus
    {
        Pending,
        Accepted,
        Declined,
        Blocked
    }
}
