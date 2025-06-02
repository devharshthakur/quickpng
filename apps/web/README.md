# 🚀 QuickPNG Web App

This is the frontend web application for QuickPNG - a simple SVG to PNG converter.

## ⚙️ Environment Setup

Create a `.env.local` file in the `apps/web` directory with the following environment variable:

```
API_BASE_URL=http://localhost:4000/api
```

This variable points to your NestJS backend API. Adjust the URL as needed for your environment.

## 💻 Development

The app includes a proxy API route at `/api/upload` that forwards file uploads to the NestJS backend and returns the converted PNG download URL to the client.

## ✨ Features

- 🖼️ Drag & drop SVG file upload
- ✅ File validation (SVG only, max 5MB)
- 📊 Real-time upload progress
- 🔄 Automatic PNG conversion via backend
- ⬇️ Download converted PNG files
- 🎨 Modern UI with toast notifications
