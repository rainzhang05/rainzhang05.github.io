# Personal Portfolio Website
Website URL: https://rainzhang.me/

## Purpose

As a university student actively seeking internship opportunities and professional experience, this portfolio website aims to:

- Present my technical skills and programming knowledge
- Showcase academic, personal, and internship projects I've completed
- Provide information about my educational background
- Offer an easy way for recruiters and potential employers to contact me
- Demonstrate my web development capabilities through the website itself

## Technologies Used

- **HTML5**: For structuring the content
- **CSS3**: For styling and animations
- **JavaScript**: For interactive elements and dynamic content
- **Formspree**: For handling contact form submissions
- **Vercel**: For website deployment

## Testing

From the repository root (requires [Node.js](https://nodejs.org/) 20+):

```bash
npm ci
npm test
```

- **Unit / DOM tests**: [Vitest](https://vitest.dev/) with [happy-dom](https://github.com/capricorn86/happy-dom) (`npm run test:unit`). Optional V8 report: `npm run test:coverage` (production `js/*` runs inside happy-dom classic scripts, so line-level coverage is not attributed to those files).
- **End-to-end tests**: [Playwright](https://playwright.dev/) serves the static site with `serve` and drives a real browser (`npm run test:e2e`). Install browsers once with `npx playwright install chromium`.

## Contact

If you're a potential employer or collaborator, please feel free to:
- Reach out through the contact form on the website
- Connect with me on [Linkedin](https://www.linkedin.com/in/rainzhang05/)
- Email me at rainzhang.zty@gmail.com
