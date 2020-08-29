self.addEventListener('push', function (event) {
    const { registration } = self;
    const notification = event.data.json() || { title: 'Notification Fallback!' };
    const promiseChain = registration.showNotification(notification.title);
    event.waitUntil(promiseChain);
});
