# My Ecommerce App

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A complete e-commerce storefront built with **React 18**. Product catalog, shopping cart, checkout flow, wishlist, customer authentication, order history, and an admin dashboard — all wired through React Context and React Router.

## Features

- **Product catalog** — browse products, product detail pages with reviews, search with a dedicated search page
- **Shopping cart** — add/remove items, quantity controls, cart drawer, persisted via storage service
- **Checkout flow** — multi-step checkout with shipping info and a payment gateway component
- **Wishlist** — save products for later, synced through context
- **Authentication** — sign up / sign in with protected routes and an auth context
- **Orders** — order history page for customers
- **Admin dashboard** — manage products and view store data
- **Store pages** — home with banner carousel and promotions, about, contact, FAQ, shipping/returns/privacy/terms pages
- **UX details** — page loader, skeleton placeholders, toast notifications, 404 page

## Tech stack

- React 18 (Create React App)
- React Router 6 — client-side routing with protected routes
- React Context API — auth, cart, wishlist, and toast state
- Bootstrap 5 + react-bootstrap and Tailwind CSS — styling
- Axios — API communication layer (`src/services/`)

## Quick start

```bash
npm install
npm start
```

Open http://localhost:3000 to view it in the browser.

### Other scripts

```bash
npm test    # run tests in watch mode
npm run build  # production build into build/
```

## Project structure

- `src/pages` — routed pages (Home, Products, ProductDetails, Cart, Checkout, Wishlist, Orders, AdminDashboard, …)
- `src/components` — reusable UI (ProductCard, Cart, Checkout, AuthForm, Header/Footer, …)
- `src/context` — AuthContext, CartContext, WishlistContext, ToastContext
- `src/services` — API layer (authService, productService, orderService, wishlistService, storageService)
- `src/hooks`, `src/utils` — shared hooks and helpers

## License

MIT — see [LICENSE](LICENSE).
