# Next.js App - Preview System

A modern Next.js application built with React 19, TypeScript, and advanced UI components, designed to provide an enhanced preview system for web content management.

## 🚀 Project Description

This Next.js application serves as an advanced frontend component of the preview system. It leverages Next.js 15 features for optimal performance, SEO, and developer experience while providing sophisticated content management capabilities.

### Key Features

- **Next.js 15**: Latest framework features with App Router
- **React 19**: Cutting-edge React features and hooks
- **TypeScript**: Full type safety and enhanced developer experience
- **Advanced UI**: Floating UI, Embla Carousel, and modern components
- **State Management**: Immer for immutable state updates
- **Undo/Redo**: Built-in undo functionality with use-undo
- **Sortable Components**: Drag-and-drop functionality with SortableJS
- **CloudFront Integration**: Global CDN for optimal performance
- **AWS Infrastructure**: Scalable cloud deployment with ECS

## 🛠️ Technology Stack

- **Framework**: Next.js 15.2.4
- **Frontend**: React 19.0.0
- **Language**: TypeScript 5.8.2
- **Styling**: CSS Modules + Modern CSS
- **State Management**: Immer + React Hooks
- **UI Components**: Floating UI, Embla Carousel
- **Drag & Drop**: SortableJS
- **Testing**: Jest + Testing Library
- **Linting**: ESLint + Prettier

## 📦 Dependencies

### Core Dependencies

- `next`: ~15.2.4
- `react`: 19.0.0
- `react-dom`: 19.0.0
- `@floating-ui/react-dom`: ^2.1.5
- `@preview-workspace/preview-lib`: ^2.2.3
- `embla-carousel-react`: ^8.6.0
- `immer`: ^10.1.1
- `sortablejs`: ^1.15.6
- `use-undo`: ^1.1.1

### Development Dependencies

- `typescript`: ~5.8.2
- `eslint`: ^9.8.0
- `eslint-config-next`: ^15.2.4
- `prettier`: ^2.6.2

## 🏗️ Development Process

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI (for deployment)
- Terraform (for infrastructure)

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:4201`

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Start production server**

   ```bash
   npm start
   ```

6. **Export static files**
   ```bash
   npm run export
   ```

### Testing

```bash
# Run tests (if configured)
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code (if using prettier)
npx prettier --write .
```

## 🚀 Deployment

### Infrastructure

The application is deployed on AWS using the following services:

- **ECS Fargate**: Container orchestration
- **Application Load Balancer**: Traffic distribution
- **CloudFront**: Global CDN and caching
- **ECR**: Container registry
- **S3**: Static asset hosting
- **CloudWatch**: Logging and monitoring

### Deployment Process

1. **Infrastructure Deployment**: Terraform manages the AWS infrastructure
2. **Build Process**: Next.js builds the application for production
3. **Docker Image**: Creates and pushes Docker image to ECR
4. **ECS Deployment**: Updates ECS service with new image
5. **Static Export**: Exports static files to S3 for CDN
6. **Cache Invalidation**: CloudFront cache is invalidated

### Environment Variables

Required environment variables for deployment:

```bash
# AWS Configuration
AWS_ACCOUNT_ID=your-aws-account-id
AWS_REGION=eu-north-1

# Infrastructure
INFRASTRUCTURE_S3_BUCKET_NAME=your-terraform-state-bucket
DYNAMODB_TABLE_NAME=your-terraform-locks-table

# Application
NEXT_APP_CLOUDFRONT_ID=your-cloudfront-distribution-id
NEXT_APP_DOMAIN=your-next-app-domain
AWS_ALB_DOMAIN=your-alb-domain
REACT_APP_DOMAIN=your-react-app-domain

# ECS Configuration
ECS_CLUSTER=preview_next_app
ECS_SERVICE=next-app-service-xxx
```

## 📋 Versioning

This project uses [Semantic Versioning](https://semver.org/) with automated releases via semantic-release.

### Version Format

- `MAJOR.MINOR.PATCH` (e.g., 1.0.0)
- Automated based on commit messages

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

### Commit Types

- `feat`: New features (minor version bump)
- `fix`: Bug fixes (patch version bump)
- `docs`: Documentation changes (patch version bump)
- `style`: Code style changes (patch version bump)
- `refactor`: Code refactoring (patch version bump)
- `perf`: Performance improvements (patch version bump)
- `test`: Test changes (patch version bump)
- `chore`: Maintenance tasks (patch version bump)

### Release Process

1. **Automatic**: Releases are triggered automatically on successful deployments
2. **Manual**: Can be triggered manually via GitHub Actions
3. **Changelog**: Automatically generated from commit messages
4. **GitHub Release**: Creates GitHub releases with release notes

## 📝 Changelog

### [Unreleased]

### [0.0.0] - Initial Release

- Initial project setup with Next.js 15 and React 19
- Advanced UI components integration
- AWS infrastructure configuration
- CI/CD pipeline setup
- Semantic release configuration
- ECS deployment with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style
- Use Next.js App Router patterns
- Leverage React 19 features appropriately

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔗 Related Projects

- [React App](./../react-app) - React frontend application
- [Preview Server](./../preview-server) - NestJS backend API
- [Preview Workspace](./../preview-workspace) - Shared library package
