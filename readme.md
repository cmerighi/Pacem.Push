# Pacem.Push
Ongoing implementation of 
a [VAPID](https://tools.ietf.org/id/draft-ietf-webpush-vapid-03.html) 
web push server, written in ASP.Net Core 3.1+.

### The Big Picture
This WebApi aims to provide all the endpoints and functionalities
that your _push-notification_-enabled _App_ would need:

- `subscribe`;
- `unsubscribe`;
- `send notifications`.

### Push Notifications as a Service
This WebApi should be accessible only by authorized clients (_Apps_).  
Authorized clients may subscribe/unsubscribe users and send relevant notifications.
  
Clients should authenticate using `OAuth2` protocol.
