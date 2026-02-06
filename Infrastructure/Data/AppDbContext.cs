using Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Challenge> Challenges { get; set; }
        public DbSet<ChallengeDay> ChallengeDays { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<ChallengeViewer> ChallengeViewers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Challenge - User Relationship
            builder.Entity<Challenge>()
                .HasOne(c => c.User)
                .WithMany(u => u.Challenges)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Challenge - Days Relationship
            builder.Entity<Challenge>()
                .HasMany(c => c.Days)
                .WithOne(d => d.Challenge)
                .HasForeignKey(d => d.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique constraint: DayNumber per Challenge
            builder.Entity<ChallengeDay>()
                .HasIndex(d => new { d.ChallengeId, d.DayNumber })
                .IsUnique();

            // Friendship Configuration
            builder.Entity<Friendship>()
                .HasOne(f => f.Requester)
                .WithMany(u => u.SentFriendRequests)
                .HasForeignKey(f => f.RequesterId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Friendship>()
                .HasOne(f => f.Addressee)
                .WithMany(u => u.ReceivedFriendRequests)
                .HasForeignKey(f => f.AddresseeId)
                .OnDelete(DeleteBehavior.Restrict);

             // Challenge Viewer Configuration
            builder.Entity<ChallengeViewer>()
                .HasOne(cv => cv.Challenge)
                .WithMany(c => c.Viewers)
                .HasForeignKey(cv => cv.ChallengeId)
                .OnDelete(DeleteBehavior.Cascade); // If challenge is deleted, viewers access is removed

            builder.Entity<ChallengeViewer>()
                .HasOne(cv => cv.User)
                .WithMany(u => u.ViewableChallenges)
                .HasForeignKey(cv => cv.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Avoid multiple cascade paths
        }
    }
}
