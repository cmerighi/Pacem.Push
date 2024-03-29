# Pacem.Push
Implementation of 
a [`VAPID`](https://tools.ietf.org/id/draft-ietf-webpush-vapid-03.html) 
web push server, written in ASP.Net 5+.

### The Big Picture
This WebApi aims to provide all the endpoints and functionalities
that your _push-notification_-enabled _App_ would need:

- `subscribe`;
- `unsubscribe`;
- `send notifications`.

### Push Notifications as a Service
This WebApi should be accessible only by authorized clients (_Apps_).

> Each client application is associated to specific `VAPID` details.

Authorized clients may subscribe/unsubscribe users and send relevant notifications.
  
Clients should authenticate via `OAuth2 Introspection` protocol.  
(The implementation of the relevant _IdentityServer_ is not provided.)

### Implementation
This implementation lean on a SqlServer store and uses
EF Core as a driver.
