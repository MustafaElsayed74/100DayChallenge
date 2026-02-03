using System.Collections.Generic;
using System.Threading.Tasks;
using Service.DTOs;

namespace Service.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }

    public interface IChallengeService
    {
        Task<ChallengeDto> CreateChallengeAsync(string userId, CreateChallengeDto dto);
        Task<List<ChallengeDto>> GetUserChallengesAsync(string userId);
        Task<ChallengeDetailDto> GetChallengeAsync(int id, string userId);
        Task<ChallengeDto> UpdateChallengeAsync(int id, string userId, UpdateChallengeDto dto);
        Task<ChallengeDayDto> UpdateDayAsync(int challengeId, int dayNumber, string userId, UpdateDayDto dto);
        Task DeleteChallengeAsync(int id, string userId);
    }
}
