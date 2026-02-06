using System.Collections.Generic;
using System.Threading.Tasks;
using Service.DTOs;

namespace Service.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<UserDetailDto> GetProfileAsync(string userId);
        Task<UserDetailDto> UpdateProfileAsync(string userId, UpdateProfileDto dto);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    }

    public interface IChallengeService
    {
        Task<ChallengeDto> CreateChallengeAsync(string userId, CreateChallengeDto dto);
        Task<List<ChallengeDto>> GetUserChallengesAsync(string userId);
        Task<ChallengeDetailDto> GetChallengeAsync(int id, string userId);
        Task<ChallengeDto> UpdateChallengeAsync(int id, string userId, UpdateChallengeDto dto);
        Task<ChallengeDayDto> UpdateDayAsync(int challengeId, int dayNumber, string userId, UpdateDayDto dto);
        Task DeleteChallengeAsync(int id, string userId);
        Task AddViewerAsync(int challengeId, string ownerId, string viewerId);
        Task RemoveViewerAsync(int challengeId, string ownerId, string viewerId);
        Task<List<UserSummaryDto>> GetChallengeViewersAsync(int challengeId, string userId);
    }
    public interface IFriendService
    {
        Task SendRequestAsync(string requesterId, string addresseeEmail);
        Task AcceptRequestAsync(int requestId, string userId);
        Task DeclineRequestAsync(int requestId, string userId);
        Task<List<FriendDto>> GetFriendsAsync(string userId);
        Task<List<FriendRequestDto>> GetPendingRequestsAsync(string userId);
        Task<List<UserSummaryDto>> SearchUsersAsync(string query, string currentUserId);
    }
}
