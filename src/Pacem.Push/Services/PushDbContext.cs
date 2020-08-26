using Microsoft.EntityFrameworkCore;

namespace Pacem.Push.Data
{
    public class PushDbContext : DbContext
    {
        public DbSet<Subscription> SubscriptionSet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // nothing to declare (yet)
            base.OnModelCreating(modelBuilder);
        }
    }
}
