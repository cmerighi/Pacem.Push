using Microsoft.EntityFrameworkCore;
using Pacem.Push.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Pacem.Push.Data
{
    public class PushDbContext : DbContext
    {
        public DbSet<Subscription> SubscriptionSet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
