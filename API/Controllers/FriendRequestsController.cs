using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Interfaces;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendRequestsController : ControllerBase
    {
        private readonly IFriendService _friendService;

        public FriendRequestsController(IFriendService friendService)
        {
            _friendService = friendService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendRequest([FromBody] SendFriendRequestDto dto)
        {
            try
            {
                await _friendService.SendRequestAsync(GetCurrentUserId(), dto.Email);
                return Ok(new { message = "Friend request sent." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("accept/{requestId}")]
        public async Task<IActionResult> AcceptRequest(int requestId)
        {
            try
            {
                await _friendService.AcceptRequestAsync(requestId, GetCurrentUserId());
                return Ok(new { message = "Friend request accepted." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("decline/{requestId}")]
        public async Task<IActionResult> DeclineRequest(int requestId)
        {
            try
            {
                await _friendService.DeclineRequestAsync(requestId, GetCurrentUserId());
                return Ok(new { message = "Friend request declined." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFriends()
        {
            var friends = await _friendService.GetFriendsAsync(GetCurrentUserId());
            return Ok(friends);
        }

        [HttpGet("requests/pending")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var requests = await _friendService.GetPendingRequestsAsync(GetCurrentUserId());
            return Ok(requests);
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string query)
        {
            var users = await _friendService.SearchUsersAsync(query, GetCurrentUserId());
            return Ok(users);
        }
    }

    public class SendFriendRequestDto
    {
        public string Email { get; set; }
    }
}
