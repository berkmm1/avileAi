# Kod İncelemesi Sonrası Görev Önerileri

## 1) Yazım hatası düzeltme görevi
**Görev adı:** Arayüzdeki marka yazımını tekilleştir ("avile" → "AliveAI")

- `frontend/src/components/Login.jsx` ve `frontend/src/components/Dashboard.jsx` içinde görünen başlıklarda ve buton metinlerinde `avile` ifadesi geçiyor.
- Proje adı README'de `AliveAI` olarak geçiyor; kullanıcı tarafında isim birliği için UI metinlerinin düzeltilmesi gerekiyor.
- Kabul kriteri:
  - Kullanıcıya görünen tüm metinlerde marka adı `AliveAI` olarak geçmeli.
  - Giriş ve dashboard ekranları arasında isimlendirme tutarlı olmalı.

## 2) Hata düzeltme görevi
**Görev adı:** Dashboard iş listesi API çağrısını çalışan endpoint'e taşı

- `frontend/src/components/Dashboard.jsx` içindeki `loadJobs()` fonksiyonu `GET /dashboard` çağırıyor.
- Backend tarafında `server.js` içinde `/dashboard` route'u tanımlı değil; sadece `/auth`, `/video`, `/webhook` mevcut.
- Sonuç: Dashboard açılışında iş listesi yükleme hatası (404/boş veri).
- Kabul kriteri:
  - Backend'e `GET /video/list` (veya benzeri) endpoint'i eklenmeli **ya da** frontend mevcut endpoint'lere uygun şekilde güncellenmeli.
  - Dashboard ilk açılışta kullanıcıya ait işleri hatasız gösterebilmeli.

## 3) Kod yorumu / dokümantasyon tutarsızlığı görevi
**Görev adı:** Çalıştırma dokümantasyonunu `.env` kullanımına göre netleştir

- README, `backend/.env.example` dosyasını `backend/.env` olarak kopyalamayı öneriyor.
- Ancak `docker-compose.yml` içinde backend ve worker servisleri doğrudan `./backend/.env.example` dosyasını `env_file` olarak kullanıyor.
- Bu anlatım, "hangi dosya gerçekten kullanılıyor" konusunda kafa karıştırıyor.
- Kabul kriteri:
  - README'de Docker akışı ile local akış ayrıştırılarak açıkça belirtilmeli.
  - Docker için `env_file` kaynağı, local için `.env` beklentisi net yazılmalı.

## 4) Test iyileştirme görevi
**Görev adı:** Video oluşturma ve iş listeleme akışı için entegrasyon testleri ekle

- Backend'de şu an test altyapısı ve otomatik test dosyası bulunmuyor.
- Özellikle kuyruk + auth + iş durumu akışı kritik olduğundan geriye dönük kırılmaları yakalayacak testlere ihtiyaç var.
- Önerilen kapsam:
  - `POST /auth/login` için başarılı/başarısız senaryo testi.
  - `POST /video/create` için token zorunluluğu testi.
  - Eklenecek liste endpoint'i (`/video/list`) için kullanıcı izolasyonu testi (sadece kendi işleri dönmeli).
- Kabul kriteri:
  - CI'da çalışacak en az bir backend test komutu (`npm test`) tanımlı olmalı.
  - Testler başarısız olduğunda kırılan senaryoyu anlaşılır şekilde raporlamalı.
