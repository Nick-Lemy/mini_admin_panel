# Environment Configuration

## Frontend Environment Variables

The frontend uses environment variables to configure the API endpoint.

### Files

1. **`.env.local`** - Your local environment configuration (not committed to git)
2. **`.env.example`** - Template file showing required environment variables

### Configuration

The frontend needs one environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:3043
```

### Setup Instructions

1. **For Development:**

   ```bash
   cd frontend
   cp .env.example .env.local
   ```

   The `.env.local` file is already created with the correct values.

2. **For Production:**
   Update `NEXT_PUBLIC_API_URL` to point to your production backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

### How It Works

In `frontend/src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3043";
```

- Uses `NEXT_PUBLIC_API_URL` from environment
- Falls back to `http://localhost:3043` if not set
- The `NEXT_PUBLIC_` prefix makes it available in the browser

### Important Notes

1. **Environment variables in Next.js:**

   - Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
   - Variables without the prefix are only available server-side
   - Changes require restarting the dev server

2. **Git Ignore:**

   - `.env.local` is in `.gitignore` (not committed)
   - `.env.example` IS committed as a template
   - Never commit sensitive credentials

3. **Restart Required:**
   After changing environment variables, restart the dev server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Backend Configuration

The backend port is configured in `backend/src/configs/constants.ts`:

```typescript
export const PORT = 3043;
```

If you change the backend port, update the frontend `.env.local` accordingly.

### Deployment

When deploying to platforms like Vercel, Netlify, or others:

1. Add `NEXT_PUBLIC_API_URL` in the platform's environment variables settings
2. Set it to your production API URL
3. The platform will inject it during build time

### Troubleshooting

**Issue:** "Failed to fetch users"

- **Check:** Is the backend running on the configured port?
- **Solution:** Start backend with `cd backend && npm run dev`

**Issue:** Environment variable not working

- **Check:** Did you prefix it with `NEXT_PUBLIC_`?
- **Solution:** Variables for browser must have this prefix

**Issue:** Changes not reflected

- **Check:** Did you restart the dev server?
- **Solution:** Stop (Ctrl+C) and restart with `npm run dev`

## Summary

✅ `.env.local` - Created with API URL  
✅ `.env.example` - Template for other developers  
✅ `.gitignore` - Configured to ignore `.env*` files  
✅ `api.ts` - Uses environment variable with fallback  
✅ Ready for development and production
