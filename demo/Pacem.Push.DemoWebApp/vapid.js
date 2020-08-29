// this script - when executed - prints down a random pair of VAPID keys...
const vapid = require('web-push');

console.log(vapid.generateVAPIDKeys());
