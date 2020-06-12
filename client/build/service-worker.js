/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/precache-manifest.ed874a2f738edb532488fe767f60c84f.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
  
  blacklist: [/^\/_/,/\/[^/?]+\.[^/]+$/],
});

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
      actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" },
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
