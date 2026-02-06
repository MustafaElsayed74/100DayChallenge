using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Interfaces;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChallengeController : ControllerBase
    {
        private readonly IChallengeService _challengeService;

        public ChallengeController(IChallengeService challengeService)
        {
            _challengeService = challengeService;
        }

        private string GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateChallengeDto dto)
        {
            try
            {
                var userId = GetUserId();
                Console.WriteLine($"[DEBUG] Create Challenge requested by User: {userId}");
                if (string.IsNullOrEmpty(userId))
                {
                    Console.WriteLine("[ERROR] UserId is null or empty");
                    return BadRequest("User ID not found in token");
                }

                var result = await _challengeService.CreateChallengeAsync(userId, dto);
                return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Challenge Create failed: {ex}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _challengeService.GetUserChallengesAsync(GetUserId());
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _challengeService.GetChallengeAsync(id, GetUserId());
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _challengeService.DeleteChallengeAsync(id, GetUserId());
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateChallengeDto dto)
        {
            try
            {
                var result = await _challengeService.UpdateChallengeAsync(id, GetUserId(), dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Days
        [HttpGet("{id}/days")]
        public async Task<IActionResult> GetDays(int id)
        {
            var challenge = await _challengeService.GetChallengeAsync(id, GetUserId());
            if (challenge == null) return NotFound();
            return Ok(challenge.Days);
        }

        [HttpPatch("{id}/days/{dayNumber}")]
        public async Task<IActionResult> UpdateDay(int id, int dayNumber, [FromBody] UpdateDayDto dto)
        {
            try 
            {
                var result = await _challengeService.UpdateDayAsync(id, dayNumber, GetUserId(), dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("{id}/viewers/{viewerId}")]
        public async Task<IActionResult> AddViewer(int id, string viewerId)
        {
            try
            {
                await _challengeService.AddViewerAsync(id, GetUserId(), viewerId);
                return Ok(new { message = "Viewer added." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/viewers/{viewerId}")]
        public async Task<IActionResult> RemoveViewer(int id, string viewerId)
        {
            try
            {
                await _challengeService.RemoveViewerAsync(id, GetUserId(), viewerId);
                return Ok(new { message = "Viewer removed." });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}/viewers")]
        public async Task<IActionResult> GetViewers(int id)
        {
            try
            {
                var viewers = await _challengeService.GetChallengeViewersAsync(id, GetUserId());
                return Ok(viewers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
