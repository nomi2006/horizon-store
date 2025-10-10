# WristCo — Free Responsive Landing Page Template

A modern, animated, and responsive landing page for a wristwatch company (or any product-based business) built with **Vite + React + Tailwind CSS v4 + Framer Motion**.

---

## 🚀 Features

- Responsive animated **Header / Navbar**
- Modern **Hero section** with CTAs
- **Popular**, **Best Sellers**, and **Recent Products** grids
- **Feature highlights** section (warranty, movement, returns, support)
- **Newsletter subscription** form
- **Footer** with company/shop/support links
- Animated **Back-to-top button**
- Modular React components for easy customization

---

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd wristco
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open the printed localhost URL.

---

## 📂 Project Structure

```
src/
 ├─ components/     # UI components (Header, Hero, Footer, etc.)
 ├─ data/           # Product and navigation data
 ├─ App.tsx         # Main page composition
 ├─ main.tsx        # Entry point
 └─ index.css       # Tailwind imports + global styles
```

---

## 📝 Customization

### Products
Edit `src/data/products.ts` to add/remove products:

```ts
{
  id: 9,
  name: "New Model",
  price: 299,
  rating: 4.5,
  image: "your-image-url",
  tags: ["popular", "recent"],
  createdAt: "2025-10-09"
}
```

### Navigation
In the same file, update `navLinks` to add/remove sections.

### Styling
- Controlled by Tailwind classes.
- Swap colors, typography, and spacing directly in the JSX.

### Animations
- Powered by **Framer Motion**.
- Example:
  ```tsx
  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} />
  ```

---

## 🌐 Deployment

Build for production:
```bash
npm run build
```

Deploy the `dist/` folder to:
- [Vercel](https://vercel.com/) (recommended)
- [Netlify](https://netlify.com/)
- GitHub Pages

---

## 📖 License

This template is **free for students, businesses, and personal projects**.  
Feel free to modify and adapt it for your needs.

---

## 🙌 Credits

Built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
