
self.addEventListener('push', function (event: PushEvent) {

    const { registration } = self as any as ServiceWorkerGlobalScope;

    const notification : Notification = event.data.json() || { title: 'Notification Fallback!' };

    const promiseChain = registration.showNotification(notification.title);

    event.waitUntil(promiseChain);
});