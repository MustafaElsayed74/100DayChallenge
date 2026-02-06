using System;

namespace Service.DTOs
{
    public class FriendDto
    {
        public int Id { get; set; } // Friendship Id
        public string FriendId { get; set; } // User Id
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public DateTime BecameFriendsOn { get; set; }
    }

    public class FriendRequestDto
    {
        public int Id { get; set; }
        public string RequesterId { get; set; }
        public string RequesterName { get; set; }
        public string RequesterUserName { get; set; }
        public string RequesterAvatar { get; set; }
        public DateTime SentOn { get; set; }
    }

    public class UserSummaryDto
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public bool IsFriend { get; set; }
        public bool HasPendingRequest { get; set; }
    }
}
