# 🚀 Contributing to QuickPNG

Thank you for your interest in contributing to QuickPNG! 🎉 I am excited to have you as a contributor. This guide will help you get started and make your contribution process smooth and enjoyable.

---

## 📋 Table of Contents

- [🤝 Ways to Contribute](#-ways-to-contribute)
- [🛠️ Development Setup](#️-development-setup)
- [📝 Contribution Workflow](#-contribution-workflow)
- [🐛 Reporting Bugs](#-reporting-bugs)
- [💡 Suggesting Features](#-suggesting-features)
- [🔧 Code Contribution Guidelines](#-code-contribution-guidelines)
- [📖 Documentation](#-documentation)
- [🧪 Testing](#-testing)
- [📦 Release Process](#-release-process)
- [💬 Community](#-community)

---

## 🤝 Ways to Contribute

There are many ways you can contribute to QuickPNG:

### 🐛 **Bug Reports**
- Found a bug? Report it on our [GitHub Issues](https://github.com/devharshthakur/quickpng/issues)
- Help us reproduce and fix issues

### 💡 **Feature Requests**
- Have an idea? Share it in [GitHub Discussions](https://github.com/devharshthakur/quickpng/discussions)
- Help design new features

### 🔧 **Code Contributions**
- Fix bugs and implement features
- Improve performance and user experience
- Add new conversion options


### 🧪 **Testing**
- Write and improve test coverage
- Test new features and report issues
- Help with cross-browser testing

### 🎨 **Design & UX**
- Improve the user interface
- Enhance user experience
- Create icons and graphics

---

## 🛠️ Development Setup

### 📋 **Prerequisites**

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) 📦
- **pnpm** (v10.11.0 or higher) 🚀
- **Git** 🌿

### ⚡ **Quick Start**

1. **🍴 Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub or use GitHub CLI
   gh repo fork devharshthakur/quickpng --clone
   ```

2. **📂 Clone Your Fork**
   ```bash
   git clone https://github.com/dev-username/quickpng.git
   cd quickpng
   ```

3. **📦 Install Dependencies**
   ```bash
   pnpm install
   ```

4. **🚀 Start Development Server**
   ```bash
   # Start both frontend and backend
   pnpm dev
   ```

5. **🌐 Open in Browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### 📁 **Project Structure**

```
quickpng/
├── 📱 apps/
│   ├── 🌐 web/          # Next.js frontend
│   └── ⚙️ api/          # NestJS backend
├── 📦 packages/
│   ├── 🎨 ui/           # Shared UI components
│   ├── 🗄️ db/           # Database configuration
│   ├── ⚙️ eslint-config/ # ESLint configuration
│   └── 📝 typescript-config/ # TypeScript configuration
├── 📋 turbo.json        # Turborepo configuration
└── 📦 package.json      # Root package.json
```

---

## 📝 Contribution Workflow

### 🔄 **Step-by-Step Process**

1. **🎯 Choose an Issue**
   - Look for issues labeled `good first issue` or `help wanted`
   - Comment on the issue to let others know you're working on it

2. **🌿 Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

3. **💻 Make Your Changes**
   - Write your code following our [coding standards](#-code-contribution-guidelines)
   - Test your changes thoroughly
   - Update documentation if needed

4. **✅ Test Your Changes**
   ```bash
   # Run linting
   pnpm lint
   
   # Run type checking
   pnpm typecheck
   
   # Run tests (when available)
   pnpm test
   ```

5. **📝 Commit Your Changes**
   ```bash
   # Use conventional commit messages
   git add .
   git commit -m "feat: add new SVG optimization feature"
   ```

6. **🚀 Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Create a Pull Request on GitHub
   - Fill out the PR template completely
   - Link any related issues

### 📋 **Commit Message Guidelines**

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: 🚀 New feature
- `fix`: 🐛 Bug fix
- `docs`: 📚 Documentation only changes
- `style`: 💄 Code style changes (formatting, etc.)
- `refactor`: ♻️ Code refactoring
- `perf`: ⚡ Performance improvements
- `test`: 🧪 Adding or updating tests
- `chore`: 🔧 Maintenance tasks

**Examples:**
```bash
feat(upload): add drag and drop file validation
fix(conversion): resolve SVG dimension parsing issue
docs(readme): update installation instructions
```

---

## 🐛 Reporting Bugs

### 📋 **Before Reporting**

1. **🔍 Search existing issues** to avoid duplicates
2. **🧪 Test with the latest version** of QuickPNG
3. **📱 Check different browsers** if it's a frontend issue

### 📝 **Bug Report Template**

When reporting a bug, please include:

```markdown
## 🐛 Bug Description
A clear and concise description of the bug.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Upload file '...'
4. See error

## ✅ Expected Behavior
What you expected to happen.

## ❌ Actual Behavior
What actually happened.

## 🖼️ Screenshots
If applicable, add screenshots to help explain the problem.

## 🌐 Environment
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 120.0]
- Version: [e.g. 1.2.0]

## 📎 Additional Context
Any other context about the problem.
```

---

## 💡 Suggesting Features

### 🎯 **Feature Request Template**

```markdown
## 💡 Feature Description
A clear and concise description of the feature you'd like to see.

## 🎯 Problem Statement
What problem does this feature solve?

## 💭 Proposed Solution
Describe your proposed solution.

## 🔄 Alternatives Considered
Any alternative solutions you've thought about.

## 📊 Additional Context
Any other context, mockups, or examples.
```

---

## 🔧 Code Contribution Guidelines

### 📏 **Code Style**

- **TypeScript**: Use TypeScript for all new code
- **Prettier**: Code formatting is handled by Prettier
- **Type Safety**: Avoid `any` types when possible

### 🏗️ **Architecture Guidelines**

#### **Frontend (Next.js)**
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use the UI component library from `@workspace/ui`

#### **Backend (NestJS)**
- Use dependency injection
- Implement proper error handling
- Add input validation with pipes
- Follow REST API conventions

### 📝 **Code Examples**

#### **✅ Good TypeScript**
```typescript
interface ConversionOptions {
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high';
}

const convertSvg = async (file: File, options: ConversionOptions): Promise<Blob> => {
  // Implementation
};
```

#### **❌ Avoid**
```typescript
const convertSvg = async (file: any, options: any): Promise<any> => {
  // Avoid using 'any' type
};
```

### 🧪 **Testing Guidelines**

- Write unit tests for new features
- Test edge cases and error conditions
- Use meaningful test descriptions
- Aim for good test coverage
---

## 📖 Documentation

### 📝 **Documentation Types**

- **README**: Keep the main README updated
- **API Documentation**: Document all API endpoints
- **Code Comments**: Add comments for complex logic
- **Examples**: Provide usage examples

### ✍️ **Documentation Style**

- Use clear, concise language
- Include code examples
- Add emojis to improve readability
- Keep it up-to-date with code changes

---

## 🧪 Testing

### 🔧 **Running Tests**

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### 📝 **Writing Tests**

- Place tests next to the code they test
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies

---


## 💬 Community

### 🤝 **Getting Help**

- **💬 Discussions**: [GitHub Discussions](https://github.com/devharshthakur/quickpng/discussions)
- **🐛 Issues**: [GitHub Issues](https://github.com/devharshthakur/quickpng/issues)

### 🎉 **Recognition**

We appreciate all contributions! Contributors will be:

- 🏆 Mentioned in release notes
- 🎖️ Recognized in our community discussions

---

## 📜 **Legal**

By contributing to QuickPNG, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

<div align="center">

**🙏 Thank you for contributing to QuickPNG! 🙏**

**Together, we're making SVG to PNG conversion better for everyone! 🚀**

[🏠 Back to README](README.md) | [📋 View Issues](https://github.com/devharshthakur/quickpng/issues) | [💬 Join Discussions](https://github.com/devharshthakur/quickpng/discussions)

</div> 