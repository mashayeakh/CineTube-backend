// Vercel serverless entry point.
// buildCommand runs `npm run build` first, producing dist/, then this re-exports the compiled app.
import app from '../dist/src/server.js';
export default app;
