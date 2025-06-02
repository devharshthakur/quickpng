# 🚀 QuickPNG Backend API

Welcome to the **QuickPNG Backend**! This is responsible for handling SVG uploads, conversion to PNG, and file management. Built with [NestJS](https://nestjs.com/) and TypeScript for scalability and maintainability.

---

## 🗂️ Project Structure

```
apps/api/
├── src/
│   ├── app.controller.ts      # Root controller
│   ├── app.module.ts          # Main NestJS module
│   ├── app.service.ts         # Root service
│   ├── conversion/            # SVG to PNG conversion logic
│   ├── db/                    # Database integration (Prisma)
│   ├── upload/                # File upload, validation, and cleanup
│   └── main.ts                # Application entry point
├── uploads/                   # Uploaded SVG files (temp)
├── uploads/images/            # Converted PNG files
├── test/                      # E2E and unit tests
├── package.json               # Project scripts and dependencies
└── README.md                  # This file
```

---

## ⚙️ How It Works

1. **Upload SVG**: Users upload SVG files via the `/upload` endpoint.
2. **Validation**: Uploaded files are validated for type, size, and content.
3. **Save & Store**: SVGs are saved temporarily, and metadata is stored in the database.
4. **Dimension Extraction**: The backend reads/fetches the SVG's width and height (or falls back to `viewBox` or defaults).
5. **Conversion**: SVGs are converted to PNG using [sharp](https://sharp.pixelplumbing.com/), with the correct dimensions.
6. **Cleanup**: The original SVG is deleted after conversion.
7. **Download**: The PNG is made available for download from `/uploads/images/`.

---

## 🏗️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Image Processing**: [sharp](https://sharp.pixelplumbing.com/)
- **Database**: [Prisma ORM](https://www.prisma.io/)
- **Validation**: [zod](https://zod.dev/)
- **XML Parsing**: [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser)

---

## 🧑‍💻 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repo** and clone it locally.
2. **Install dependencies**:
   ```sh
   pnpm install
   ```
3. **Run the backend locally**:
   ```sh
   pnpm run dev
   ```
4. **Test your changes**:
   ```sh
   pnpm run test
   ```
5. **Submit a pull request** with a clear description of your changes.

### Coding Guidelines

- Use TypeScript and keep the codebase type-safe (avoid `any` unless necessary).
- Follow the existing folder structure and naming conventions.
- Write clear, concise commit messages.
- Add or update tests for new features or bug fixes.

### Useful Scripts

- `pnpm  dev` – Start the server in watch mode
- `pnpm  test` – Run all tests
- `pnpm  format` – Format code with Prettier
- `pnpm  lint` – Lint the codebase
