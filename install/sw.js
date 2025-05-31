const CACHE_NAME = "signature645-cache-v1";
const FILES_TO_CACHE = [
  "/install/index.html",
  "/install/manifest.json",
  "/install/logo_ume.png",
  "/install/icon-192.png",
  "/install/icon-512.png"
];

// 설치 단계: 지정된 파일들을 캐시에 추가
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())  // 바로 활성화 단계로 넘어가기
  );
});

// 활성화 단계: 이전에 사용되지 않는 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// fetch 단계: 캐시된 파일이면 캐시 응답, 없으면 네트워크 요청
self.addEventListener('fetch', event => {
  // 동일 오리진 요청만 처리 (외부 리소스는 패스)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
