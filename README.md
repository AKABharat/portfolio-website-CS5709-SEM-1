# AKABharat Digital Portfolio — CS5709 Assignment 1

Digital portfolio developed for **CS5709 – Software Engineering Evolution, Assessment 1 (Phase 1)**.

## Table of Contents

1. [Assessment Coverage](#assessment-coverage)
2. [Portfolio Features](#portfolio-features)
3. [Phase 1 / Phase 2 Scope](#phase-1--phase-2-scope)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Local Setup](#local-setup)
7. [Environment Variables](#environment-variables)
8. [Deployment](#deployment)
9. [Instant Messaging](#instant-messaging)
10. [Evaluation and Future Enhancements](#evaluation-and-future-enhancements)

## Assessment Coverage

| Rubric area | Evidence in this project |
|---|---|
| Discovery | Feature list, Phase 1 / Phase 2 scope, table of contents |
| Design | Architecture, control flow and component description in `Assessment1_Report.md` |
| Development – Iteration 1 | Home + About + Education + Professional Knowledge + Projects |
| Development – Iteration 2 | Tailwind CSS, responsive styling, Express routing and active navigation |
| Evaluation | Critical review and enhancement suggestions in `Assessment1_Report.md` |

## Portfolio Features

- Home page
- About page
- Education page
- Professional Knowledge page
- Projects page
- Picture gallery
- Video gallery with selectable playlist
- Blog listing and blog detail pages
- User sign-up and login for blog creation
- Instant messaging through the Crisp chat widget
- Responsive navigation and page styling
- 404 error page
- Health-check endpoint for deployment verification

## Phase 1 / Phase 2 Scope

### Phase 1 — implemented

1. Multi-page portfolio structure
2. Responsive navigation and CSS styling
3. Home, About, Education, Professional Knowledge and Projects
4. Picture and video gallery
5. Blog
6. Authentication for blog creation
7. Instant messaging facility
8. MongoDB-backed users and blogs
9. Routing and 404 handling

### Phase 2 — planned enhancements

1. Blog comments and moderation
2. Admin dashboard and content management
3. Persistent chat/message history owned by the application
4. Search across portfolio and blog content
5. Contact form with email delivery
6. Automated tests and CI/CD checks
7. Improved production session storage
8. Performance, accessibility and analytics improvements

## Architecture

The application follows a server-rendered **MVC-style Express architecture**:

```text
Browser
   |
   v
Express routes
   |
   +--> Static portfolio pages --> EJS views
   |
   +--> Authentication --> User model --> MongoDB
   |
   +--> Blog --> Blog controller --> Blog model --> MongoDB
   |
   +--> Gallery --> EJS gallery view
   |
   +--> Crisp chat widget --> External messaging service
```

Detailed architecture and control-flow diagrams are included in `Assessment1_Report.md`.

## Project Structure

```text
/
├── app.js
├── package.json
├── package-lock.json
├── .env.example
├── controllers/
│   ├── blog_controller.js
│   └── user_controller.js
├── middleware/
│   └── auth.js
├── models/
│   ├── blog.js
│   └── user.js
├── routes/
│   ├── auth.js
│   └── blog.js
├── public/
│   ├── css/
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
    ├── 404.ejs
    └── partials/
        ├── header.ejs
        └── footer.ejs
```

## Local Setup

### Requirements

- Node.js
- npm
- MongoDB / MongoDB Atlas

### Install

```bash
npm install
```

### Configure environment

Create `.env` from `.env.example` and add your MongoDB connection string and session secret.

### Run

```bash
npm run dev
```

Open `http://localhost:8000`.

For a production-style local run:

```bash
npm start
```

The application also exposes `GET /health`.

## Environment Variables

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Session signing secret |
| `PORT` | HTTP port; defaults to 8000 locally |

**Do not commit `.env` or database credentials to GitHub.**

## Deployment

This is a Node.js/Express application with a MongoDB dependency, so deploy it as a **web service**, not as a static GitHub Pages site.

A suitable deployment flow is:

1. Push the latest code to GitHub.
2. Create a Render Web Service connected to the repository.
3. Build command: `npm install` or `npm run build`
4. Start command: `npm start`
5. Add `MONGO_URI` and `SESSION_SECRET` in Render Environment Variables.
6. Deploy and test `/health`, `/`, `/gallery/videos`, `/blog` and authentication.
7. Put the final live URL below and in the report.

**Live URL:** _Add after deployment._

MongoDB Atlas must also allow the deployed application to connect to the cluster.

## Instant Messaging

The footer loads the Crisp chat widget site-wide. This provides the portfolio's instant messaging facility without exposing application/database credentials.

## Evaluation and Future Enhancements

Current strengths:

- Clear multi-page structure
- Server-side rendering with EJS
- Reusable header/footer partials
- MongoDB-backed authentication and blogging
- Responsive styling
- Working picture/video gallery
- External instant messaging integration

Recommended Phase 2 improvements:

- Add automated testing
- Add persistent production session storage
- Add blog comments/moderation
- Add application-owned real-time chat history
- Replace remote gallery images with controlled local assets where licensing permits
- Add stronger error handling and validation
- Add accessibility and performance testing

See `Assessment1_Report.md` for the full assessment report.
