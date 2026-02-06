using System;
using System.Collections.Generic;
using Core.Enums;

namespace Service.DTOs
{
    public class RegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string UserId { get; set; }
    }

    public class CreateChallengeDto
    {
        public string Title { get; set; }
        public string GoalDescription { get; set; }
        public DateTime StartDate { get; set; }
        public string Notes { get; set; }
        public int DurationDays { get; set; } = 100; // Default to 100 if not specified
    }

    public class ChallengeDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string GoalDescription { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Notes { get; set; }
        // Simple stats for list view
        public int CompletedDays { get; set; }
        public int SkippedDays { get; set; }
        public int CurrentStreak { get; set; }
        public string OwnerId { get; set; }
        public string OwnerName { get; set; }
    }

    public class ChallengeDetailDto : ChallengeDto
    {
        public List<ChallengeDayDto> Days { get; set; }
    }

    public class ChallengeDayDto
    {
        public int DayNumber { get; set; }
        public DateTime Date { get; set; }
        public DayStatus Status { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string Note { get; set; }
    }
    
    public class UpdateDayDto
    {
        public DayStatus Status { get; set; }
        public string Note { get; set; }
    }

    public class UpdateChallengeDto
    {
        public string Title { get; set; }
        public string GoalDescription { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateProfileDto
    {
        public string FullName { get; set; }
        public string Avatar { get; set; }
        public string UserName { get; set; }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class UserDetailDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string UserName { get; set; }
    }
}
