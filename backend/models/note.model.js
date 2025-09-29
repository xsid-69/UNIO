import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, index: true },
  semester: { type: String, index: true },
  branch: { type: String, index: true },
  pdfUrl: { type: String, required: false, default: '' }, // URL to the PDF (ImageKit or external)

}, { collection: 'notes' });

const Note = mongoose.model('Note', NoteSchema);
export default Note;
