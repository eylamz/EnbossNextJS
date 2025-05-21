# Project Structure

```
enboss-project/
├── src/
│   ├── app/
│   │   ├── [lang]/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── brands/
│   │   │   │   │   └── route.js
│   │   │   │   ├── categories/
│   │   │   │   │   └── route.js
│   │   │   │   ├── related/
│   │   │   │   │   └── route.js
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   ├── guides/
│   │   │   │   ├── related/
│   │   │   │   │   └── route.js
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   ├── skateparks/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   └── auth/
│   │   │       ├── me/
│   │   │       │   └── route.js
│   │   │       ├── login/
│   │   │       │   └── route.js
│   │   │       └── register/
│   │   │       │   └── route.js
│   │   │       └── route.js
│   │   ├── cart/
│   │   │   └── page.js
│   │   ├── checkout/
│   │   │   └── page.js
│   │   ├── guides/
│   │   │   ├── [slug]/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── pages/
│   │   │   └── _app.js
│   │   ├── shop/
│   │   │   ├── [slug]/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── skateparks/
│   │   │   ├── [slug]/
│   │   │   │   └── page.js
│   │   │   └── page.js
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── assets/
│   │   ├── icons/
│   │   ├── Cart.js
│   │   ├── index.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── shop/
│   │   │   ├── ProductFilter.js
│   │   │   └── ProductCard.js
│   │   ├── guides/
│   │   │   ├── GuideFilter.js
│   │   │   └── GuideCard.js
│   │   ├── skatepark/
│   │   │   ├── SkateparkMap.js
│   │   │   ├── SkateparkFilter.js
│   │   │   └── SkateparkCard.js
│   │   ├── ui/
│   │   │   └── Icon.js
│   │   ├── admin/
│   │   └── user/
│   ├── context/
│   │   ├── ThemeContext.js
│   │   ├── CartContext.js
│   │   └── AuthContext.js
│   ├── hooks/
│   ├── lib/
│   │   ├── cloudinary.js
│   │   ├── auth.js
│   │   ├── redis.js
│   │   └── db.js
│   ├── models/
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Guide.js
│   │   ├── Skatepark.js
│   │   └── User.js
│   ├── utils/
│   │   └── i18n/
│   │       ├── client.ts
│   │       ├── getDictionary.ts
│   │       ├── index.ts
│   │       ├── server.ts
│   │       └── shared.ts
│   └── middleware.ts
├── public/
│   ├── locales/
│   │       ├── en/
│   │       │   ├── checkout.json
│   │       │   ├── common.json
│   │       │   ├── guide.json
│   │       │   ├── home.json
│   │       │   ├── shop.json
│   │       │   └── skatepark.json
│   │       ├── he/
│   │       │   ├── checkout.json
│   │       │   ├── common.json
│   │       │   ├── guide.json
│   │       │   ├── home.json
│   │       │   ├── shop.json
│   │       │   └── skatepark.json
│   │       ├── file.svg
│   │       ├── globe.svg
│   │       ├── next.svg
│   │       ├── vercel.svg
│   │       └── window.svg
│   └── middleware.ts
├── scripts/
│   └── seed-data.js
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── next-i18next.config.js
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

Note: This tree structure excludes:
- node_modules/
- .next/
- .git/
