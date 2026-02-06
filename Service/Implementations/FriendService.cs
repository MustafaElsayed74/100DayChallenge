using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Service.DTOs;
using Service.Interfaces;

namespace Service.Implementations
{
    public class FriendService : IFriendService
    {
        private readonly AppDbContext _context;

        public FriendService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendRequestAsync(string requesterId, string addresseeEmail)
        {
            var addressee = await _context.Users.FirstOrDefaultAsync(u => u.Email == addresseeEmail);
            if (addressee == null) throw new Exception("User not found.");
            if (addressee.Id == requesterId) throw new Exception("Cannot send friend request to yourself.");

            var existing = await _context.Friendships
                .FirstOrDefaultAsync(f => 
                    (f.RequesterId == requesterId && f.AddresseeId == addressee.Id) ||
                    (f.RequesterId == addressee.Id && f.AddresseeId == requesterId));

            if (existing != null)
            {
                if (existing.Status == FriendshipStatus.Accepted) throw new Exception("Already friends.");
                if (existing.Status == FriendshipStatus.Pending) throw new Exception("Friend request already pending.");
                // If Declined, maybe allow resending? For now throw.
                if (existing.Status == FriendshipStatus.Declined)
                {
                    // Reactivate? Or just throw. Let's allowing resending by updating existing.
                    existing.Status = FriendshipStatus.Pending;
                    existing.RequesterId = requesterId; // In case roles switched
                    existing.AddresseeId = addressee.Id;
                    await _context.SaveChangesAsync();
                    return;
                }
            }

            var friendship = new Friendship
            {
                RequesterId = requesterId,
                AddresseeId = addressee.Id,
                Status = FriendshipStatus.Pending
            };

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();
        }

        public async Task AcceptRequestAsync(int requestId, string userId)
        {
            var request = await _context.Friendships.FindAsync(requestId);
            if (request == null) throw new Exception("Friend request not found.");
            if (request.AddresseeId != userId) throw new Exception("Not authorized to accept this request.");

            request.Status = FriendshipStatus.Accepted;
            await _context.SaveChangesAsync();
        }

        public async Task DeclineRequestAsync(int requestId, string userId)
        {
            var request = await _context.Friendships.FindAsync(requestId);
            if (request == null) throw new Exception("Friend request not found.");
            if (request.AddresseeId != userId) throw new Exception("Not authorized to decline this request.");

            // request.Status = FriendshipStatus.Declined; 
            _context.Friendships.Remove(request); // Remove completely to allow clean retry or just clean up
            await _context.SaveChangesAsync();
        }

        public async Task<List<FriendDto>> GetFriendsAsync(string userId)
        {
            var friendships = await _context.Friendships
                .Include(f => f.Requester)
                .Include(f => f.Addressee)
                .Where(f => (f.RequesterId == userId || f.AddresseeId == userId) && f.Status == FriendshipStatus.Accepted)
                .ToListAsync();

            var friends = friendships.Select(f => {
                var isRequester = f.RequesterId == userId;
                var friend = isRequester ? f.Addressee : f.Requester;
                return new FriendDto
                {
                    Id = f.Id,
                    FriendId = friend.Id,
                    FullName = friend.FullName ?? friend.UserName,
                    UserName = friend.UserName,
                    Email = friend.Email,
                    Avatar = friend.Avatar,
                    BecameFriendsOn = f.CreatedOn
                };
            }).ToList();

            return friends;
        }

        public async Task<List<FriendRequestDto>> GetPendingRequestsAsync(string userId)
        {
            var requests = await _context.Friendships
                .Include(f => f.Requester)
                .Where(f => f.AddresseeId == userId && f.Status == FriendshipStatus.Pending)
                .ToListAsync();

            return requests.Select(f => new FriendRequestDto
            {
                Id = f.Id,
                RequesterId = f.RequesterId,
                RequesterName = f.Requester.FullName ?? f.Requester.UserName,
                RequesterUserName = f.Requester.UserName,
                RequesterAvatar = f.Requester.Avatar,
                SentOn = f.CreatedOn
            }).ToList();
        }

        public async Task<List<UserSummaryDto>> SearchUsersAsync(string query, string currentUserId)
        {
            if (string.IsNullOrWhiteSpace(query)) return new List<UserSummaryDto>();

            var users = await _context.Users
                .Where(u => u.Id != currentUserId && (u.Email.Contains(query) || u.FullName.Contains(query) || u.UserName.Contains(query)))
                .Take(20)
                .ToListAsync();

            // Get friendship status
            var friendIds = await _context.Friendships
                .Where(f => (f.RequesterId == currentUserId || f.AddresseeId == currentUserId))
                .ToListAsync();

            return users.Select(u => {
                var friendship = friendIds.FirstOrDefault(f => f.RequesterId == u.Id || f.AddresseeId == u.Id);
                return new UserSummaryDto
                {
                    UserId = u.Id,
                    FullName = u.FullName ?? u.UserName,
                    UserName = u.UserName,
                    Avatar = u.Avatar,
                    Email = u.Email,
                    IsFriend = friendship?.Status == FriendshipStatus.Accepted,
                    HasPendingRequest = friendship?.Status == FriendshipStatus.Pending
                };
            }).ToList();
        }
    }
}
