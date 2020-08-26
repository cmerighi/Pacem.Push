﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Pacem.Push
{
    [Table("Subscriptions", Schema ="Push")]
    public class Subscription
    {
        public Subscription() { }

        [Key, Column, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// The user identifier.
        /// </summary>
        [Required, Column]
        public string UserId { get; set; }

        /// <summary>
        /// The subscription's endpoint.
        /// </summary>
        [Required, Column]
        public string Endpoint { get; set; }

        /// <summary>
        /// The expiration time in UNIX milliseconds, if any.
        /// </summary>
        [Column]
        public long? Expires { get; set; }

        /// <summary>
        /// Point on elliptic curve 
        /// </summary>
        [Required]
        [Column]
        public string P256Dh { get; set; }

        /// <summary>
        /// The secret key.
        /// </summary>
        [Required]
        [Column]
        public string Auth { get; set; }

    }
}
