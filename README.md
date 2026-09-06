# Personal Portfolio Website
Website URL: https://rainzhang.me/

## Purpose

As a university student actively seeking internship opportunities and professional experience, this portfolio website aims to:

- Present my technical skills and programming knowledge
- Showcase academic, personal, and internship projects I've completed
- Provide information about my educational background
- Offer an easy way for recruiters and potential employers to contact me
- Demonstrate my web development capabilities through the website itself

## The site

One scrolling page, in two languages:

- `/` — English
- `/ja` — Japanese

intro → Experience → Selected work → Other work → Background → Contact.

It is built on a small design system of my own: one typeface, ivory paper, one
accent, no borders or shadows, and a single interaction — rows that open in
place. My resume and cover letter use the same system, so everything a
recruiter sees from me comes from one hand.

## Technologies Used

- **Next.js**: For the application framework, routing, and production build
- **React**: For building the user interface with reusable components
- **TypeScript**: For type-safe development across the codebase
- **Tailwind CSS**: For styling and layout, with every value bound to a design token
- **Albert Sans**: Self-hosted through `next/font/local`, subset and preloaded
- **Formspree**: For handling contact form submissions
- **Vitest and Playwright**: For unit and end-to-end tests
- **Vercel**: For website deployment

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # both languages are prerendered
npm run lint && npm run typecheck && npm run test
npm run test:e2e
```

## Contact

If you're a potential employer or collaborator, please feel free to:
- Reach out through the contact form on the website
- Connect with me on [Linkedin](https://www.linkedin.com/in/rainzhang05/)
- Email me at rainzhang.zty@gmail.com
