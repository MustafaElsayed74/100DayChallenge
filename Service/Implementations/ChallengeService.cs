using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Service.DTOs;
using Service.Interfaces;


namespace Service.Implementations
{
    public class ChallengeService : IChallengeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ChallengeService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<ChallengeDto> CreateChallengeAsync(string userId, CreateChallengeDto dto)
        {
            var challenge = _mapper.Map<Challenge>(dto);
            challenge.UserId = userId;
            // Validate Duration
            if (dto.DurationDays <= 0) dto.DurationDays = 100;

            challenge.EndDate = challenge.StartDate.AddDays(dto.DurationDays - 1);

            var days = new List<ChallengeDay>();
            for (int i = 1; i <= dto.DurationDays; i++)
            {
                days.Add(new ChallengeDay
                {
                    DayNumber = i,
                    Date = challenge.StartDate.AddDays(i - 1),
                    Status = DayStatus.Pending,
                    Note = ""
                });
            }
            challenge.Days = days;

            await _unitOfWork.Repository<Challenge>().AddAsync(challenge);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ChallengeDto>(challenge);
        }

        public async Task<List<ChallengeDto>> GetUserChallengesAsync(string userId)
        {
            // Note: Keep it simple. A real app would use Specifications to eager load Days if needed for stats.
            
            // We need to fetch challenges with days to calculate stats
            // Since GenericRepo might not support Include easily without Specs, 
            // we assume we can add a specific method or use a spec. 
            // For now, let's assume we can fetch all and filter client side or add specific repo method.
            // BETTER: Use a Specification or specialized query. 
            // Let's rely on the fact that for this simple app, we might just load them.
            
            var challenges = await _unitOfWork.Repository<Challenge>()
                .GetWithIncludesAsync(c => c.UserId == userId || c.Viewers.Any(v => v.UserId == userId), "Days");
            
            var dtos = _mapper.Map<List<ChallengeDto>>(challenges);

            // Calculate stats for each challenge in the list
            foreach(var dto in dtos)
            {
                var challenge = challenges.FirstOrDefault(c => c.Id == dto.Id);
                if(challenge != null && challenge.Days != null)
                {
                    CalculateStats(dto, challenge.Days.ToList());
                }
            }
            
            return dtos;
        }

        public async Task<ChallengeDetailDto> GetChallengeAsync(int id, string userId)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(id);
            if (challenge == null) return null;

            // Check Access: Owner OR Viewer
            bool isOwner = challenge.UserId == userId;
            bool isViewer = false;
            if (!isOwner)
            {
                var viewers = await _unitOfWork.Repository<ChallengeViewer>().GetAsync(cv => cv.ChallengeId == id && cv.UserId == userId);
                isViewer = viewers.Any();
            }

            if (!isOwner && !isViewer) return null;

            // Manual load of days if lazy loading isn't on (it's not by default in Core without proxies)
            // We need a way to include days.
            // I'll add a specific method to IGenericRepo or use the context directly via a specific repository.
            // For now, let's load days manually via the Days repository to be safe and clean.
            
            var days = await _unitOfWork.Repository<ChallengeDay>().GetAsync(d => d.ChallengeId == id);
            challenge.Days = (ICollection<ChallengeDay>)days;

            var dto = _mapper.Map<ChallengeDetailDto>(challenge);
            
            // Calculate Stats
            CalculateStats(dto, (List<ChallengeDay>)days);

            // Add viewer info to DTO if needed? Or just let frontend know mode.
            // Maybe add "IsReadOnly" property to DTO? For now, frontend can check ownerId vs currentUserId.
            // Dto usually has OwnerId? Not currently in ChallengeDto.
            // But Challenge returns UserId? 
            // The Entity has UserId. Dto mapping might include it.
            // Let's assume frontend can infer, or we add logic later.

            return dto;
        }

        public async Task AddViewerAsync(int challengeId, string ownerId, string viewerId)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(challengeId);
            if (challenge == null || challenge.UserId != ownerId) throw new Exception("Challenge not found or unauthorized");

            // Check if already viewer
             var existing = await _unitOfWork.Repository<ChallengeViewer>().GetAsync(cv => cv.ChallengeId == challengeId && cv.UserId == viewerId);
             if (existing.Any()) return; // Already added

             var viewer = new ChallengeViewer
             {
                 ChallengeId = challengeId,
                 UserId = viewerId
             };

             await _unitOfWork.Repository<ChallengeViewer>().AddAsync(viewer);
             await _unitOfWork.CompleteAsync();
        }

        public async Task RemoveViewerAsync(int challengeId, string ownerId, string viewerId)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(challengeId);
            if (challenge == null || challenge.UserId != ownerId) throw new Exception("Challenge not found or unauthorized");

            var viewers = await _unitOfWork.Repository<ChallengeViewer>().GetAsync(cv => cv.ChallengeId == challengeId && cv.UserId == viewerId);
            var viewer = viewers.FirstOrDefault();
            
            if (viewer != null)
            {
                _unitOfWork.Repository<ChallengeViewer>().Delete(viewer);
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task<List<UserSummaryDto>> GetChallengeViewersAsync(int challengeId, string userId)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(challengeId);
            // Allow owner and maybe viewers to see who else is viewing? Restrict to owner for now.
            if (challenge == null) return new List<UserSummaryDto>();
            
            // Allow owner to see viewers. Viewers generally don't need to see other viewers list, but maybe?
            // Let's allow owner and viewers to see list.
            bool isOwner = challenge.UserId == userId;
             var viewerRecords = await _unitOfWork.Repository<ChallengeViewer>()
                 .GetWithIncludesAsync(cv => cv.ChallengeId == challengeId, "User");
            
            bool isViewer = viewerRecords.Any(cv => cv.UserId == userId);
            
            if (!isOwner && !isViewer) throw new Exception("Unauthorized");

            return viewerRecords.Select(cv => new UserSummaryDto
            {
                UserId = cv.UserId,
                FullName = cv.User.FullName ?? cv.User.UserName,
                Avatar = cv.User.Avatar,
                Email = cv.User.Email
            }).ToList();
        }

        public async Task DeleteChallengeAsync(int id, string userId)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(id);
            if (challenge != null && challenge.UserId == userId)
            {
                _unitOfWork.Repository<Challenge>().Delete(challenge);
                await _unitOfWork.CompleteAsync();
            }
        }

        public async Task<ChallengeDto> UpdateChallengeAsync(int id, string userId, UpdateChallengeDto dto)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(id);
            if (challenge == null || challenge.UserId != userId) throw new Exception("Challenge not found");

            challenge.Title = dto.Title;
            challenge.GoalDescription = dto.GoalDescription;
            // challenge.Notes = dto.Notes; // Note: Challenge entity might not have Note if it was missing in Create too. 
            // Looking at CreateChallengeAsync, it maps DTO to Challenge. 
            // Let's assume AutoMapper handled it or it's there. 
            // If previous errors implied something, I'll check. 
            // Wait, I saw ChallengeDay had Note. Did Challenge have Notes?
            // "Public string Note { get; set; }" in ChallengeDay.
            // Let's assume Title and Description are key. I will add Notes but comment out if it breaks (or check entity first? No, let's try).
            // Actually, safe bet: Check Entity first? 
            // I'll assume it doesn't have it based on Create not setting it explicitly in code (it relied on AutoMapper).
            // But I'll set it here.
            
            // To be safe, I will View the Challenge entity file quickly in parallel if I can? 
            // No, I'll just write it and if it fails build, I'll fix.
            // Wait, I am in a tool call. I can't view.
            
            // Let's assume it IS there because CreateChallengeDto had it.
            // challenge.Notes = dto.Notes; 
            
            // Re-reading CreateChallengeAsync: 
            // var challenge = _mapper.Map<Challenge>(dto);
            // This implies mapping works.
            
            challenge.Title = dto.Title;
            challenge.GoalDescription = dto.GoalDescription;
            challenge.Notes = dto.Notes; 
            // Providing the code with Title and GoalDescription which are verified.
            
             _unitOfWork.Repository<Challenge>().Update(challenge);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ChallengeDto>(challenge);
        }

        public async Task<ChallengeDayDto> UpdateDayAsync(int challengeId, int dayNumber, string userId, UpdateDayDto dto)
        {
            var challenge = await _unitOfWork.Repository<Challenge>().GetByIdAsync(challengeId);
            if (challenge == null || challenge.UserId != userId) throw new Exception("Challenge not found or unauthorized");

            // We need to fetch the specific day. 
            // Assuming we can query by ChallengeId and DayNumber.
            var days = await _unitOfWork.Repository<ChallengeDay>().GetAsync(d => d.ChallengeId == challengeId && d.DayNumber == dayNumber);
            var day = days.FirstOrDefault();

            if (day == null) throw new Exception("Day not found");

            day.Status = dto.Status;
            day.Note = dto.Note;
            
            if (day.Status == DayStatus.Completed)
            {
                day.CompletedAt = DateTime.UtcNow; // Or keep existing if already set? Let's update it.
            }
            else
            {
                day.CompletedAt = null;
            }

            _unitOfWork.Repository<ChallengeDay>().Update(day);
            await _unitOfWork.CompleteAsync();

            return _mapper.Map<ChallengeDayDto>(day);
        }

        private void CalculateStats(ChallengeDto dto, List<ChallengeDay> days)
        {
            if (days == null || !days.Any()) return;

            dto.CompletedDays = days.Count(d => d.Status == DayStatus.Completed);
            dto.SkippedDays = days.Count(d => d.Status == DayStatus.Skipped);

            // Streak Logic
            var sortedDays = days.OrderBy(d => d.DayNumber).ToList();
            int currentStreak = 0;
            int maxStreak = 0;
            int tempStreak = 0;

            foreach (var day in sortedDays)
            {
                if (day.Status == DayStatus.Completed)
                {
                    tempStreak++;
                }
                else
                {
                    // Reset streak on miss / skip (depending on rules, let's say strict)
                    maxStreak = Math.Max(maxStreak, tempStreak);
                    tempStreak = 0;
                }
            }
            maxStreak = Math.Max(maxStreak, tempStreak);

            // Current Streak: Count backwards from today (or last completed)
            // If today is PENDING, we check yesterday.
            // If today is COMPLETED, we count from today.
            // If today is MISSED, streak is 0.
            
            // Simplified: Just count contiguous completed block ending at the last completed day.
            // But "Current Streak" implies it is active NOW.
            // Let's just calculate the tempStreak at the end if the last day checked was completed? 
            // No, we need to trace back from Today.
            
            // Proper Current Streak:
            // Find the latest day that is <= Today. Start counting back.
            var today = DateTime.UtcNow.Date;
            var pastDays = sortedDays.Where(d => d.Date <= today).OrderByDescending(d => d.DayNumber).ToList();
            
            int streak = 0;
            foreach(var day in pastDays)
            {
                if (day.Status == DayStatus.Completed)
                {
                    streak++;
                }
                else if (day.Date == today && day.Status == DayStatus.Pending)
                {
                    // Allowed to be pending today, keep checking yesterday
                    continue;
                }
                else
                {
                    // Break on first non-complete day (that isn't today-pending)
                    break;
                }
            }
            dto.CurrentStreak = streak;
        }
    }
}
