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
        }
    }
}
