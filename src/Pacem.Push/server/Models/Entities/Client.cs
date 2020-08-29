using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pacem.Push.Entities
{
    [Table("Clients", Schema = "Push")]
    public class Client
    {
        [Key]
        public string ClientId { get; set; }

        [Column]
        public string Name { get; set; }

        [Column("Enabled")]
        public bool IsEnabled { get; set; }

        [Column, Required, MaxLength(127)]
        public string VapidPublicKey { get; set; }

        [Column, Required, MaxLength(63)]
        public string VapidPrivateKey { get; set; }

        [Column, Required, MaxLength(63), RegularExpression(@"^(mailto:|https?:\/\/).+")]
        public string VapidSubject { get; set; }

        public virtual ICollection<Subscription> Subscriptions { get; set; } = new HashSet<Subscription>();
    }
}
