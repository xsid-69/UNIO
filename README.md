# UNIO — University Study Workspace

UNIO is a student-focused study platform for finding course notes, syllabi, previous-year papers, solved questions, and subject-specific resources in one focused workspace. It includes email/password and Google authentication, profile-based course context, admin publishing, and resilient in-browser PDF reading.

## Live application

[Open UNIO](https://unitech-ruvf.onrender.com/)

## Dashboard

![UNIO student dashboard](https://res.cloudinary.com/dhox2ocnr/image/upload/v1786444333/Screenshot_2026-08-11_160011_karu94.png)

## Features

- Personalized dashboard based on branch, year, and semester
- Email/password and Google OAuth authentication
- Notes, syllabus, previous-year papers, and solved-question libraries
- Inline PDF reader with pagination, zoom, fullscreen, native fallback, and download
- Profile and academic-context management
- Role-protected administrative PDF publishing
- Responsive navigation, keyboard focus, reduced-motion support, and accessible touch targets
- Study AI workspace preview

## Technology

**Frontend:** React 19, Vite 7, Redux Toolkit, React Router, Tailwind CSS 4, GSAP, Lenis, Framer Motion, React PDF, Axios, and Phosphor Icons.

**Backend:** Node.js, Express 5, MongoDB/Mongoose, JWT, Passport Google OAuth, ImageKit, Multer, and Axios.

## Repository structure

```text
UNIO/
├── backend/                  # Express API, authentication, MongoDB, and file proxying
├── frontend/                 # React/Vite application
├── DESIGN.md                 # Product design system
├── PRODUCT.md                # Product direction
└── README.md
```

## Local development

### Prerequisites

- Node.js 20.19 or newer
- npm
- MongoDB connection string
- Google OAuth application
- ImageKit account

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Fill the copied file with your own development credentials. Never commit `.env` or `.env.local`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`; the backend defaults to `http://localhost:3000`.

## Environment variables

### Backend

| Variable | Purpose |
| --- | --- |
| `NODE_ENV` | Use `production` in deployed environments |
| `PORT` | HTTP port supplied by the host or `3000` locally |
| `MONGO_DB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random signing secret |
| `FRONTEND_URL` | Exact public frontend origin, without a trailing slash |
| `BACKEND_URL` | Exact public API origin, without a trailing slash |
| `CORS_ORIGINS` | Optional comma-separated additional trusted origins |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `IMAGEKIT_PUBLIC_KEY` / `IMAGEKIT_PRIVATE_KEY` | ImageKit API credentials |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit delivery endpoint and default allowed PDF host |
| `PDF_ALLOWED_HOSTS` | Optional comma-separated extra PDF source hosts |
| `MONGO_DNS_SERVERS` | Optional local DNS resolver override; normally unset in production |

### Frontend

| Variable | Purpose |
| --- | --- |
| `VITE_BACKEND_URL` | Public backend origin used by browser API requests |
| `BACKEND_URL` | Optional Vite development-proxy target |

## Production checks

```bash
cd frontend
npm ci
npm run lint
npm run build

cd ../backend
npm ci
npm run check
```

The backend exposes `GET /api/health`. It reports `200` only when MongoDB is connected.

## Deployment requirements

1. Deploy the backend with all required production environment variables and `NODE_ENV=production`.
2. Deploy `frontend/dist` after running `npm run build` with the production `VITE_BACKEND_URL`.
3. Configure the host to rewrite `/*` to `/index.html` with a `200` response. On Render, add this rule in the static site's **Redirects/Rewrites** settings; `_redirects` is included for hosts that support that file format. The bundled `404.html` also restores deep links as a fallback.
4. Add `${BACKEND_URL}/api/auth/google/callback` to Google OAuth’s authorized redirect URIs.
5. Add the exact frontend and backend origins to Google’s authorized JavaScript origins where applicable.
6. Keep frontend and backend URLs on HTTPS. Cross-site session cookies use `Secure`, `HttpOnly`, and `SameSite=None` in production.
7. Verify `/api/health`, email login, Google login, logout, direct route refreshes, PDF preview, fallback rendering, and downloads after deployment.

## Security notes

- Authentication tokens are stored in HttpOnly cookies, not URL parameters or browser storage.
- Password hashes are excluded from API serialization.
- PDF proxying permits only configured hosts, limits response size and timeout, and validates PDF signatures.
- Secrets, local environment overrides, build output, editor metadata, and dependency directories are ignored by Git.

## License

This project is licensed under the MIT License.