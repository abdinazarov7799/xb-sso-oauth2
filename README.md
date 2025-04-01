# XB SSO Package

**XB SSO Package** bu OAuth2 va PKCE (Proof Key for Code Exchange) bilan ishlaydigan SSO (Single Sign-On) autentifikatsiya paketi bo‘lib, React loyihalari uchun mo‘ljallangan.

---

## ❗ Muhim ogohlantirish

> **Ushbu paket faqat Xalq Banki SSO tizimi bilan ishlash uchun mo‘ljallangan.**  
> **Boshqa tizimlarda to‘g‘ri ishlamasligi mumkin.**  
> Agar siz boshqa autentifikatsiya xizmatlari bilan ishlashni xohlasangiz, **konfiguratsiyani mos ravishda o‘zgartirishingiz kerak**.

---

## 🚀 Xususiyatlari

- ✅ OAuth2 + PKCE yordamida autentifikatsiya
- ✅ JWT tokenni `iss` va `aud` bo„yicha verify qilish
- ✅ UI mustaqil – buton va notifikatsiyalarni `renderComponent` orqali berish
- ✅ `useSSO` hook orqali token va autentifikatsiyani boshqarish
- ✅ Logout funksiyasi mavjud

---

## 📦 O‘rnatish

```sh
npm install xb-sso-oauth2
```

---

## ⚙️ Konfiguratsiya

```ts
interface SSOConfig {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  REDIRECT_URI: string;
  SERVER_ENDPOINT: string;
  FRONTEND_ENDPOINT: string;
  OAUTH2_TOKEN_ENDPOINT: string;
  OAUTH2_JWKS_ENDPOINT: string;
  OAUTH2_AUTHORIZE_ENDPOINT: string;
  SCOPES: string;
  ISSUER: string;
  AUDIENCE: string;
}
```

---

## 🧹 Foydalanish

### 1. `SSOLogin` komponenti

```tsx
import React from "react";
import { SSOLogin } from "xb-sso-oauth2";
import { Button } from "your-ui-library"; // yoki oddiy <button>

const config = {
  CLIENT_ID: "your-client-id",
  CLIENT_SECRET: "your-client-secret",
  REDIRECT_URI: "https://your-app.com/callback",
  SERVER_ENDPOINT: "https://sso.xb.uz",
  FRONTEND_ENDPOINT: "https://your-app.com",
  OAUTH2_TOKEN_ENDPOINT: "https://sso.xb.uz/oauth2/token",
  OAUTH2_JWKS_ENDPOINT: "https://sso.xb.uz/oauth2/jwks",
  OAUTH2_AUTHORIZE_ENDPOINT: "https://sso.xb.uz/oauth2/authorize",
  SCOPES: "openid profile",
  ISSUER: "https://sso.xb.uz",
  AUDIENCE: "xb-frontend"
};

const App = () => {
  const handleToken = (token: string) => {
    console.log("Access token:", token);
  };

  const handleAuth = (auth: boolean) => {
    console.log("Authenticated:", auth);
  };

  return (
    <SSOLogin
      config={config}
      setToken={handleToken}
      setAuthenticated={handleAuth}
      renderComponent={(openSSO, isOpen, isReady) =>
        <Button onClick={openSSO} disabled={!isReady || isOpen}>
          Tizimga kirish
        </Button>
      }
    />
  );
};
```

---

### 2. `Logout` komponenti

```tsx
import React from "react";
import { Logout } from "xb-sso-oauth2";

const AppLogout = () => {
  const config = { /* yuqoridagi config bilan bir xil */ };

  return (
    <Logout
      config={config}
      setAuthenticated={() => console.log("Chiqdi")}
      setToken={() => console.log("Token tozalandi")}
      onLogout={() => alert("Tizimdan chiqildi")}
    />
  );
};
```

---

## 🧐 Eslatma

- `renderComponent` orqali siz o‘zingizga qulay bo‘lgan button yoki UI elementni kiritasiz.
- Paket hech qanday UI kutubxonaga bog‘liq emas.
- `window.open` orqali yangi oynada autentifikatsiya ishlaydi, `accessToken` esa `localStorage` orqali uzatiladi.

---

## 📄 Litsenziya

MIT

