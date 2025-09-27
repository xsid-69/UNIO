# TODO List for Notes Upload Feature

## Backend Implementation
- [ ] Analyze existing authentication middleware (`backend/middlewares/auth.middleware.js`).
- [ ] Analyze existing notes routes (`backend/routes/notes.routes.js`).
- [ ] Implement authentication middleware for notes routes.
- [ ] Implement admin role check for ImageKit upload endpoint.
- [ ] Integrate ImageKit SDK and configure credentials.
- [ ] Create API endpoint for saving notes.
- [ ] Create API endpoint for uploading PDFs to ImageKit (admin only).
- [ ] Update `note.model.js` if necessary to store ImageKit URLs.

## Frontend Implementation
- [ ] Create/Update `NotesPage.jsx` for notes input and PDF upload.
- [ ] Implement UI for saving notes.
- [ ] Implement UI for PDF upload, including a file input.
- [ ] Conditionally render the PDF upload UI/button for admins.
- [ ] Integrate frontend with backend API endpoints for saving notes and uploading PDFs.
- [ ] Ensure authentication is handled on the frontend for accessing notes.

## Configuration & Security
- [ ] Securely manage ImageKit credentials (e.g., using environment variables).

## Testing
- [ ] Test saving notes as a regular user.
- [ ] Test PDF upload as an admin user.
- [ ] Test PDF upload as a regular user (should be restricted).
- [ ] Test accessing notes endpoints as an unauthenticated user (should be restricted).
