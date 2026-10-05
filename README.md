# AKABharat Digital Portfolio: CS5709 Assessment 1 (Phase 1)

A server-rendered digital portfolio built for **CS5709 – Software Engineering Evolution, Semester 1, 2026/7** (Assessment 1, Phase 1).

- **Live site:** https://portfolio-website-cs5709-sem-1.onrender.com/
- **Source code:** https://github.com/AKABharat/portfolio-website-CS5709-SEM-1
- **Full report:** [`Assessment1_Report.md`](./Assessment1_Report.md) (discovery, design diagrams, development, evaluation)
- **In-site Readme page:** `/readme`

## Table of Contents

1. [Assessment Coverage](#assessment-coverage)
2. [Features](#features)
3. [Phase 1 and Phase 2 Scope](#phase-1-and-phase-2-scope)
4. [Site Map and Routes](#site-map-and-routes)
5. [Architecture](#architecture)
6. [Data Model](#data-model)
7. [Project Structure](#project-structure)
8. [Local Setup](#local-setup)
9. [Environment Variables](#environment-variables)
10. [Deployment](#deployment)
11. [Instant Messaging](#instant-messaging)
12. [Evaluation and Future Enhancements](#evaluation-and-future-enhancements)

## Assessment Coverage

| Rubric area | Evidence in this project |
|---|---|
| Discovery | Feature list grouped by phase, requirements and site map (this file and report section 1) |
| Design | Block, control flow and component diagrams in `Assessment1_Report.md` section 2 |
| Development – Iteration 1 | Home + About + Education + Professional Knowledge + Projects + Gallery + Blog, navigation bar, routing |
| Development – Iteration 2 | Tailwind CSS, responsive layout, interactive gallery, Express routing, 404 page, authentication |
| Evaluation | Testing, critical review and prioritised enhancements in `Assessment1_Report.md` section 5 |

## Features

- Home, About, Education, Professional Knowledge and Projects pages
- Picture gallery with category filter and lightbox
- Video gallery with an embedded player and selectable playlist
- Blog with public list and post pages
- Sign-up, login and logout with bcrypt-hashed passwords
- Blog creation for logged-in users only
- Instant messaging through the Crisp chat widget on every page
- Sticky, responsive navigation bar with active-page highlight and mobile menu
- In-site Readme page
- Custom 404 page
- `/health` endpoint for deployment checks

## Phase 1 and Phase 2 Scope

### Phase 1 (implemented)

1. Multi-page portfolio with shared header and footer
2. Responsive navigation and Tailwind CSS styling
3. Home, About, Education, Professional Knowledge, Projects
4. Picture gallery and video gallery
5. Blog with MongoDB storage
6. Authentication protecting blog creation
7. Instant messaging facility
8. Routing, 404 handling and Readme page
9. Deployment to Render

### Phase 2 (planned)

1. Blog comments and moderation
2. Admin dashboard and database-driven content
3. Application-owned chat with stored history
4. Search across pages and blog posts
5. Contact form with email delivery
6. Automated tests and CI
7. MongoDB-backed session store and hardened cookies
8. Accessibility, performance and analytics improvements

## Site Map and Routes

| Method | Route | Description | Access |
|---|---|---|---|
| GET | `/` | Home | Public |
| GET | `/about` | About | Public |
| GET | `/education` | Education and certifications | Public |
| GET | `/professional-knowledge` | Work experience | Public |
| GET | `/projects` | Projects | Public |
| GET | `/gallery`, `/gallery/pictures` | Picture gallery | Public |
| GET | `/gallery/videos` | Video gallery | Public |
| GET | `/blog` | Blog list | Public |
| GET | `/blog/:id` | Blog post | Public |
| GET, POST | `/blog/new` | Create a post | Login required |
| GET, POST | `/signup` | Register | Public |
| GET, POST | `/login` | Log in | Public |
| GET, POST | `/logout` | Log out | Public |
| GET | `/readme` | In-site Readme | Public |
| GET | `/health` | Health check | Public |
| any | other | 404 page | Public |

## Architecture

The application is a server-rendered **MVC-style Express app**.

```text
Browser
   |
   v
Express (app.js)
   |
   +--> Static pages ------------> EJS views
   |
   +--> routes/auth.js ----------> user_controller --> User model --> MongoDB
   |
   +--> routes/blog.js
          |-- requireLogin (only /blog/new)
          +--> blog_controller ---> Blog model ------> MongoDB
                      |
                      +----------> EJS views

Browser also loads: Crisp chat, YouTube embeds, Google Fonts
```

Block, control flow and component diagrams are in `Assessment1_Report.md`.

| Layer | Technology |
|---|---|
| Runtime and server | Node.js, Express 5 |
| Views | EJS with header and footer partials |
| Styling | Tailwind CSS, Poppins font |
| Database | MongoDB Atlas via Mongoose |
| Auth | express-session, bcryptjs |
| Hosting | Render (web service), GitHub (source) |

## Data Model

| Collection | Fields |
|---|---|
| `User` | `username` (unique), `password` (bcrypt hash), timestamps |
| `Blog` | `title`, `content`, `author` (ref User), `authorName`, timestamps |

## Project Structure

```text
/
├── app.js                      # entry point: server, session, page routes, 404
├── package.json
├── .env.example                # template for environment variables
├── Assessment1_Report.md       # full assessment report
├── controllers/
│   ├── blog_controller.js
│   └── user_controller.js
├── middleware/
│   └── auth.js                 # requireLogin
├── models/
│   ├── blog.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── blog.js
├── public/
│   ├── css/                    # input.css, output.css
│   └── images/
└── views/
    ├── index.ejs
    ├── about.ejs
    ├── education.ejs
    ├── professional-knowledge.ejs
    ├── projects.ejs
    ├── gallery.ejs
    ├── blog.ejs
    ├── blog-detail.ejs
    ├── blog-create.ejs
    ├── signup.ejs
    ├── login.ejs
    ├── readme.ejs
    ├── 404.ejs
    └── partials/
        ├── header.ejs
        └── footer.ejs
```

## Local Setup

### Requirements

- Node.js (current LTS) and npm
- A MongoDB database (MongoDB Atlas free tier works)

### Steps

```bash
git clone https://github.com/AKABharat/portfolio-website-CS5709-SEM-1.git
cd portfolio-website-CS5709-SEM-1
npm install
cp .env.example .env     # then edit .env with your values
npm run dev              # development with auto-restart
```

Or run it normally:

```bash
npm start
```

Open http://localhost:8000.

To rebuild the Tailwind stylesheet while editing styles:

```bash
npm run tailwind
```

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>
SESSION_SECRET=replace-with-a-long-random-string
PORT=8000
```

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret used to sign session cookies |
| `PORT` | HTTP port; the host sets it on Render, defaults to 8000 locally |

**Never commit `.env` or database credentials.** `.env` is listed in `.gitignore`.

## Deployment

The app needs a server and a database, so it is deployed as a **Render web service**, not as static hosting such as GitHub Pages.

1. Push the code to GitHub.
2. In Render, create a **Web Service** from the repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add `MONGO_URI` and `SESSION_SECRET` under Environment.
6. In MongoDB Atlas, allow network access from Render.
7. After deploy, test `/health`, `/`, `/gallery/videos`, `/blog`, sign-up and login.

Live URL: https://portfolio-website-cs5709-sem-1.onrender.com/

## Instant Messaging

The footer loads the **Crisp** chat widget on every page. Visitors can message the owner from any page, and messages arrive in the Crisp inbox. No application or database credentials are exposed to the widget.

## Evaluation and Future Enhancements

**Strengths**

- Clear separation of routes, controllers, models and views
- Reusable header and footer partials
- Hashed passwords, secrets in environment variables, escaped blog output
- Responsive, keyboard-friendly layout
- All Phase 1 features working on a public URL

**Known limitations (addressed in Phase 2)**

- Sessions are held in server memory and are lost on restart
- No form validation, CSRF protection or rate limiting
- Any registered user can publish blog posts
- Tailwind is loaded from the CDN script rather than only the compiled stylesheet
- Gallery photos are hotlinked from external sites
- Page content is stored in view files, not the database
- No automated tests yet

**Recommended next steps**

1. MongoDB session store and secure cookie options
2. Input validation, CSRF tokens and login rate limiting
3. Owner-only posting with moderation and comments
4. Local, optimised gallery images with alt text
5. Jest and Supertest tests with a GitHub Actions workflow
6. Admin dashboard and database-driven content
7. Application-owned real-time chat with history
8. Lighthouse and WCAG accessibility audit

See `Assessment1_Report.md` for the full critical review and prioritised enhancement table.

## Author

AKABharat · [GitHub](https://github.com/AKABharat)

## License

See [LICENSE](./LICENSE).
