# PaketShop.uz

PaketShop.uz - qadoqlash mahsulotlari uchun full-stack web ilova.

Stack:
- Frontend: React 19 + TypeScript + Vite
- Backend: Express + TypeScript
- Database: Neon Postgres yoki local JSON fallback
- Admin auth: server-side password + signed token
- Qo'shimcha: Telegram bot hook, Gemini Live assistant

## Local ishga tushirish

Root va server dependency'larini o'rnating:

```bash
npm install
npm --prefix server install
```

Development server:

```bash
npm run dev
```

Default local URL'lar:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3002`
- Health: `http://localhost:3002/health`

## Environment

Frontend uchun `.env`:

```env
GEMINI_API_KEY=
VITE_API_URL=http://localhost:3002/api
```

Backend uchun `server/.env`:

```env
PORT=3002
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
DATABASE_URL=
ADMIN_PASSWORD=change-me
ADMIN_NAME=Akramjon (Admin)
ADMIN_SESSION_SECRET=change-this-admin-session-secret
ADMIN_MAX_LOGIN_ATTEMPTS=5
ADMIN_LOGIN_WINDOW_MINUTES=15
BOT_TOKEN=
ADMIN_CHAT_ID=
WEBHOOK_URL=
```

Izoh:
- `DATABASE_URL` bo'sh bo'lsa backend `server/data/local-db.json` fallback bilan ishlaydi.
- `DATABASE_URL` berilsa Neon/Postgres jadvallari avtomatik initialize qilinadi.
- `BOT_TOKEN` bo'sh bo'lsa Telegram bot skip qilinadi.

## Foydali buyruqlar

```bash
npm run dev
npm run build
npm run build:server
npm run test
npm run smoke
npm run seed
```

Server-only buyruqlar:

```bash
npm --prefix server run dev
npm --prefix server run build
npm --prefix server run test
npm --prefix server run seed
```

## Test va smoke check

Unit testlar:

```bash
npm run test
```

Live smoke check:

```bash
npm run smoke
```

`smoke` skripti quyidagilarni tekshiradi:
- frontend HTML ochilishi
- backend health endpoint
- products endpoint

## Admin

Admin login frontend orqali `/profile` sahifasidan qilinadi.

Admin imkoniyatlari:
- mahsulot qo'shish va o'chirish
- barcha buyurtmalarni ko'rish
- statusni yangilash
- qidiruv va filter

Admin session server tomonda tekshiriladi. Login endpoint rate limit bilan himoyalangan.

## Deploy

`render.yaml` frontend va backend deploy uchun tayyorlangan.

Muhim env'lar:
- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `GEMINI_API_KEY`
- `BOT_TOKEN` (ixtiyoriy)

## Loyiha tuzilmasi

```text
paketshopuz/
|-- components/
|-- context/
|-- pages/
|   |-- admin/
|-- public/
|-- scripts/
|-- server/
|   |-- src/
|   |   |-- bot/
|   |   |-- db/
|   |   |-- lib/
|   |   |-- routes/
|   |   `-- data/
|-- App.tsx
|-- package.json
`-- render.yaml
```

## Hozirgi yaxshilanishlar

- `npm run dev` frontend + backend birga ishga tushadi
- Neon DB va local fallback qo'llab-quvvatlanadi
- admin password frontend kodida emas
- admin login rate limit bilan himoyalangan
- order va product API'larda validation bor
- admin orders sahifasida qidiruv, filter va status boshqaruvi bor
