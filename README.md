# 万物YOROZUYA

万物YOROZUYA is a playful, anime-inspired e-commerce demo built around the 万事屋 (“Yorozuya”) concept from *Gintama*. It showcases a fully responsive product catalog, dynamic search & filter, a client-side cart, a contact form, and a gamified “Play 2048 & Earn Coupons” rewards system—all in plain HTML, Tailwind CSS, and vanilla JavaScript, backed by simple serverless functions for product data.

---

## Design Process

This site is aimed at **anime fans** and casual shoppers who want a fun, interactive storefront:

- **Who?** Fans of *Gintama* and curious shoppers looking for a quirky retail experience.  
- **What?** Browse products, add to cart, contact the shop, and earn coupons by playing a daily 2048 game.  
- **Why?** To learn modern front-end patterns—responsive design, localStorage state, modular JS—and to deliver an engaging user journey.

### User Stories

- As a **visitor**, I want to browse all products so that I can see what’s available.  
- As a **visitor**, I want to search & filter by price so I can find items within my budget.  
- As a **user**, I want to add items to a cart and see the cart count update in real time.  
- As a **logged-in user**, I want to play a 2048 game once per day to earn coupons.  
- As a **user**, I want to send a message via a contact form and receive feedback on success or errors.

> **Wireframes & Mockups**  
> - Figma: [Yorozuya Store Wireframes](https://www.figma.com/proto/WDgYlfYRiXNg5Y3SpLGhqt/Untitled?node-id=1-6247&p=f&t=3wyfem64ozivM1lm-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A6247)


---

## Features

### Existing Features

- **Responsive product catalog**: Grid layout shifts from 1→4 columns across breakpoints.  
- **Search & filter**: Live filtering by keyword and price range.  
- **Product detail page**: Large hero image, full description, price, and “Add to Cart” button.  
- **Client-side cart**: Items persisted in `localStorage` with a floating cart count badge.  
- **Contact form**: Inline validation and success/error messaging.  
- **Daily rewards game**: Embedded 2048 game with a per-email daily play limit and local leaderboard.  

### Features Left to Implement

- Integration with a real **payment gateway** (Stripe, PayPal).  
- **User authentication** & persistent profiles.  
- **Backend database** for products, orders, and leaderboard. 
- **Order history** & shipping calculations.  
- **Accessibility** improvements (ARIA roles, keyboard nav).  
- **Internationalization** (multi-language support).

---

## Technologies Used

- **HTML5** — semantic page structure  
- **Tailwind CSS** — utility-first styling & responsive design  
- **JavaScript (ES6+)** — DOM manipulation, fetch API, localStorage  
- **Node.js / Serverless** — product data endpoints on Render.com  
- **Render.com** — hosting static assets + serverless functions  
- **Figma** — wireframes & mockups  

---

## Testing

#### Manual Test Scenarios

1. **Product Listing**  
   - Load `/products.html`; verify grid displays all items.  
   - Search for a term that matches a title; expect filtered results.  
   - Enter min/max prices; expect correct subset.

2. **Cart Functionality**  
   - Click “Add to Cart” on a product card; badge increments.  
   - Visit detail page → add to cart; badge updates.  
   - Refresh page; cart count persists.

3. **Product Details**  
   - Access `/product.html?id=1`; details load without errors.  
   - Invalid `id` shows an error message.

4. **Contact Form**  
   - Submit with empty fields → validation errors.  
   - Submit with invalid email → error prompt.  
   - Submit valid form → success alert and form reset.

5. **Rewards Game**  
   - Unauthenticated → clicking “Start 2048” redirects to login.  
   - Play once per day per email; further attempts are blocked.  
   - Leaderboard updates with new high scores.

6. **Responsive Layout**  
   - View on phone and desktop fits nicely.

---

## Credits

### Content

- Product data & placeholders from [DummyJSON](https://dummyjson.com).
- Game2048 from [Game2048](https://gist.github.com/kishi001/0e614ff8ee7e3ad55946).
- Icons from [Heroicons](https://heroicons.com).

### Media

- Product images are mock assets for demonstration purposes.

### Acknowledgements

- Inspired by the *Gintama* 万事屋 concept.  
-------------------------------------------------------------------------
