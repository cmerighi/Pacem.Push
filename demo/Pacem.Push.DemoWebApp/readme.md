# Demo Client App
This client App exploits [Pacem JS](https://js.pacem.it) to subscribe/unsubscribe
to/from the `VAPID` Push Server and to send push notification, all in a purely **declarative** fashion.

### `/wwwroot/index.html`
Contains all the logic, placed on stage via the following components:

- [`PacemServiceWorkerElement`](https://js.pacem.it/basic/serviceworker-proxy):  
Communicates with the underlying `ServiceWorkerRegistration` and `PushManager`.
- [`PacemFetchElement`](https://js.pacem.it/basic/fetch):
Instances of it handle the various HTTP requests.
- and then _Buttons_ and _Data islands_...

## Get Started
Setup the application content before actually launching the app, by executing:

```cmd
npm run build
```