
self.addEventListener('push', event => {
  const { image, tag, url, title, text } = event.data.json();
  console.log('New notification');
  const options = {
      data: url,
      body: text,
      icon: image,
      vibrate: [200, 100, 200],
      tag: tag,
      badge: "/favicon.ico",
      actions: [{ action: "Detail", title: "View Profile", icon: "https://via.placeholder.com/128/ff0000" },
    {action: "Close", title: "Dismiss", icon: ""}]
    };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
})

self.addEventListener('notificationclick', (event) => {
  if (!event.action) {
    console.log('No button clicked');
    return;
  }
  switch (event.action) {
    case 'Detail':
      clients.openWindow(event.notification.data);
      event.notification.close();
      break;
    case 'Close':
      event.notification.close();
      console.log('notification Ignored');
      break;
    default:
      event.notification.close();
      console.log(`The ${event.action} action is unknown`);
      break;
  }
});
