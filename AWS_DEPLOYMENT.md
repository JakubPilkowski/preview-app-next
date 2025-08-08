# Next.js AWS Deployment Setup

This document describes the AWS deployment architecture for the Next.js application.

## Architecture Overview

```
Internet → CloudFront → ALB → ECS Fargate → Next.js Container
                    ↓
                S3 (static assets)
```

## Components

### 1. CloudFront (CDN)

- Serves static assets (CSS, JS, images) from S3
- Provides global distribution and caching
- Handles SSL termination

### 2. S3 Bucket

- Stores static assets (`_next/static`, `public/`)
- Configured for static website hosting
- Accessible via CloudFront

### 3. Application Load Balancer (ALB)

- Routes traffic to ECS tasks
- Provides health checks and load balancing
- Handles SSL termination (if configured)

### 4. ECS Fargate

- Runs the Next.js application containers
- Handles dynamic content and API routes
- Auto-scales based on demand
- Serverless container orchestration

### 5. ECR (Elastic Container Registry)

- Stores Docker images
- Integrated with ECS for deployments

## Required AWS Resources

### IAM Roles

1. **S3_UPLOAD_ROLE_NAME** - For uploading static assets to S3
2. **ECR_PUSH_ROLE_NAME** - For pushing Docker images to ECR
3. **ECS_DEPLOY_ROLE_NAME** - For deploying to ECS

### S3 Bucket

- **Bucket Name**: `your-nextjs-static-assets`
- **Purpose**: Store static assets
- **Configuration**: Static website hosting enabled

### CloudFront Distribution

- **Distribution ID**: `your-cloudfront-distribution-id`
- **Origin**: S3 bucket
- **Behaviors**: Cache static assets

### ECR Repository

- **Repository Name**: `next-app`
- **Region**: `eu-north-1`

### ECS Cluster & Service

- **Cluster Name**: `next-app-cluster`
- **Service Name**: `next-app-service`
- **Launch Type**: FARGATE
- **Port**: 3000

## Environment Variables

### Build Time

- `NODE_ENV=production`
- `ASSET_PREFIX=https://your-cloudfront-domain.cloudfront.net`

### Runtime

- `PORT=3000`
- `HOSTNAME=0.0.0.0`

## Deployment Process

1. **Build and Upload Static Assets**

   - Build Next.js application with static export config
   - Upload static assets to S3 (optimized for CDN)
   - Invalidate CloudFront cache

2. **Build and Push Docker Image**

   - Build Docker image with standalone output
   - Push to ECR

3. **Deploy to ECS Fargate**
   - Update ECS service
   - Force new deployment

## Configuration Files

### next.config.js

- `assetPrefix`: Points to CloudFront for static assets
- `output: 'standalone'`: Enables Docker deployment

### Dockerfile

- Multi-stage build for optimization
- Uses Node.js 18 Alpine
- Standalone output for minimal image size

### GitHub Actions (.github/workflows/deploy.yml)

- Automated deployment pipeline
- Three-stage process: assets → Docker → ECS

### CloudFormation (cloudformation-ecs.yml)

- Infrastructure as Code for ECS resources
- Includes ALB, security groups, and IAM roles

## Setup Instructions

1. Create AWS resources (S3, CloudFront, ECR, ECS)
2. Deploy CloudFormation stack for ECS infrastructure
3. Configure IAM roles with appropriate permissions
4. Set GitHub repository secrets:
   - `AWS_ACCOUNT_ID`
   - `S3_UPLOAD_ROLE_NAME`
   - `ECR_PUSH_ROLE_NAME`
   - `ECS_DEPLOY_ROLE_NAME`
5. Update environment variables in workflow file
6. Push to main branch to trigger deployment

## Cost Optimization

- S3: Pay per storage and requests
- CloudFront: Pay per request
- ECS Fargate: Pay per compute time
- ALB: Pay per hour and per request
- ECR: Pay per storage

## Security Considerations

- All IAM roles use least privilege principle
- CloudFront provides DDoS protection
- ECS runs in isolated VPC environment
- S3 bucket configured for CloudFront access only
- Security groups restrict traffic flow
