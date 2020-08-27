using Microsoft.EntityFrameworkCore;
using Pacem.Push.Entities;

namespace Pacem.Push.Data
{
    public class PushDbContext : DbContext
    {
        public PushDbContext(DbContextOptions<PushDbContext> options)
            : base(options)
        {
        }

        public DbSet<Subscription> SubscriptionSet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // nothing to declare (yet)
            base.OnModelCreating(modelBuilder);
        }
    }
}
