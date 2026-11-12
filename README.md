# Portfolio

A personal portfolio site built with plain HTML, CSS and JavaScript. It has no backend, no build step and no dependencies to install.

**Sections:** Hero, About, Skills (filterable), Projects, Leadership (timeline), Education, Certificates (carousel; click to view and verify), Contact.

**Features:** dark and light mode, scroll-reveal animations, typing effect, scroll progress bar, active-section nav, mobile menu, certificate carousel and viewer, back-to-top button, toast notifications, reduced-motion support, and SEO and security headers.

```
├── index.html       The page
├── css/styles.css   Styles (theme tokens for light and dark mode)
├── css/marble*.svg  Marble backgrounds (white for light mode, black for dark)
├── js/data.js       ← All your content goes here
├── js/main.js       Rendering and interactions
└── vercel.json      Clean URLs + security headers (used only on Vercel)
```

## Edit your content

Open `js/data.js` and change the values. It covers the profile, skills, experience, education and certificates.

- If a section's list is empty, the section and its nav link are hidden.
- `avatar_url`, `resume_url` and each certificate's `image_url` can be a full URL, or a path to a file you add to this folder, such as `assets/me.jpg` or `assets/resume.pdf`.
- `profile.email` is where messages from the contact form go.

## Contact form

The site has no server, so the form doesn't send anything by itself. When a visitor clicks **Send message**, their email app opens with a draft addressed to `profile.email`. The draft is pre-filled with their subject, message, name and email address. A hidden honeypot field silently ignores bots.

## Preview locally

Open `index.html` in a browser, or use a static server. For example:

- VS Code: install the **Live Server** extension, right-click `index.html` and choose *Open with Live Server*
- or `npx serve .`, then open the URL it prints

## Deploy

Any static host works, such as Vercel, Netlify, GitHub Pages or Cloudflare Pages. Upload the folder as it is.

On **Vercel**: import the repository, set Framework Preset to **Other**, leave the build command and output directory empty, and deploy. Vercel also applies the headers in `vercel.json`.

## Customising the look

Colours, fonts and corner radius are CSS variables at the top of `css/styles.css`, such as `--accent`, `--accent-2` and `--font-head`. The dark-mode values are in the two blocks right below them. The marble background is drawn by `css/marble.svg` (light) and `css/marble-dark.svg` (dark); lower the `opacity` on the `veins` layer to make the veining subtler.
