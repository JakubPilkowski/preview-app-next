# CloudFront Origins Configuration Guide

This guide explains how to configure CloudFront origins for your Next.js application with S3 + ECS Fargate architecture.

## Architecture Overview

```
Internet → CloudFront → S3 (static assets) + ALB (dynamic content)
```

## Required Origins

### 1. S3 Origin (Static Assets)

- **Purpose**: Serve static files (CSS, JS, images, etc.)
- **Domain**: `your-nextjs-static-assets.s3.eu-north-1.amazonaws.com`
- **Protocol**: HTTPS
- **Origin Access**: Origin Access Identity (OAI)

### 2. ALB Origin (Dynamic Content)

- **Purpose**: Serve dynamic Next.js content (pages, API routes)
- **Domain**: `your-alb-name.eu-north-1.elb.amazonaws.com`
- **Protocol**: HTTP (CloudFront handles HTTPS)
- **Origin Access**: Public

## Cache Behaviors Configuration

### Static Assets (S3 Origin)

| Path Pattern      | Cache Policy     | Compress | TTL    |
| ----------------- | ---------------- | -------- | ------ |
| `/_next/static/*` | CachingOptimized | Yes      | 1 year |
| `/public/*`       | CachingOptimized | Yes      | 1 year |
| `*.js`            | CachingOptimized | Yes      | 1 year |
| `*.css`           | CachingOptimized | Yes      | 1 year |
| `*.png`           | CachingOptimized | No       | 1 year |
| `*.jpg`           | CachingOptimized | No       | 1 year |
| `*.svg`           | CachingOptimized | Yes      | 1 year |
| `*.ico`           | CachingOptimized | No       | 1 year |

### Dynamic Content (ALB Origin)

| Path Pattern   | Cache Policy    | Compress | TTL |
| -------------- | --------------- | -------- | --- |
| `/*` (default) | CachingDisabled | Yes      | 0   |

## Manual Setup Steps

### 1. Create CloudFront Distribution

1. Go to AWS CloudFront console
2. Click "Create Distribution"
3. Configure origins:

#### S3 Origin

```
Origin Domain: your-nextjs-static-assets.s3.eu-north-1.amazonaws.com
Origin Path: (leave empty)
Origin ID: S3-StaticAssets
Origin Access: Origin Access Identity
```

#### ALB Origin

```
Origin Domain: your-alb-name.eu-north-1.elb.amazonaws.com
Origin Path: (leave empty)
Origin ID: ALB-DynamicContent
Origin Protocol: HTTP Only
```

### 2. Configure Cache Behaviors

#### Default Behavior (ALB)

```
Path Pattern: Default (*)
Target Origin: ALB-DynamicContent
Cache Policy: CachingDisabled
Compress Objects: Yes
```

#### Static Assets Behaviors

Create separate behaviors for each static asset pattern:

1. **Next.js Static Files**

   ```
   Path Pattern: /_next/static/*
   Target Origin: S3-StaticAssets
   Cache Policy: CachingOptimized
   Compress Objects: Yes
   ```

2. **Public Assets**

   ```
   Path Pattern: /public/*
   Target Origin: S3-StaticAssets
   Cache Policy: CachingOptimized
   Compress Objects: Yes
   ```

3. **JavaScript Files**

   ```
   Path Pattern: *.js
   Target Origin: S3-StaticAssets
   Cache Policy: CachingOptimized
   Compress Objects: Yes
   ```

4. **CSS Files**

   ```
   Path Pattern: *.css
   Target Origin: S3-StaticAssets
   Cache Policy: CachingOptimized
   Compress Objects: Yes
   ```

5. **Image Files**
   ```
   Path Pattern: *.png
   Target Origin: S3-StaticAssets
   Cache Policy: CachingOptimized
   Compress Objects: No
   ```

### 3. S3 Bucket Policy

Ensure your S3 bucket has the correct policy for CloudFront access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity YOUR_OAI_ID"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-nextjs-static-assets/*"
    }
  ]
}
```

## Using CloudFormation

Deploy the provided `cloudformation-cloudfront.yml` template:

```bash
aws cloudformation create-stack \
  --stack-name next-app-cloudfront \
  --template-body file://cloudformation-cloudfront.yml \
  --parameters \
    ParameterKey=S3BucketName,ParameterValue=your-nextjs-static-assets \
    ParameterKey=ALBDomainName,ParameterValue=your-alb-name.eu-north-1.elb.amazonaws.com \
  --capabilities CAPABILITY_IAM
```

## Environment Variables

Update your GitHub Actions workflow with the correct values:

```yaml
env:
  CLOUDFRONT_DISTRIBUTION_ID: your-actual-distribution-id
  ASSET_PREFIX: https://your-cloudfront-domain.cloudfront.net
  ALB_DOMAIN: your-actual-alb-domain
```

## Testing

### Test Static Assets

```bash
curl -I https://your-cloudfront-domain.cloudfront.net/_next/static/chunks/main.js
# Should return 200 and be served from S3
```

### Test Dynamic Content

```bash
curl -I https://your-cloudfront-domain.cloudfront.net/
# Should return 200 and be served from ALB
```

## Troubleshooting

### Common Issues

1. **403 Forbidden on S3 assets**

   - Check S3 bucket policy
   - Verify Origin Access Identity

2. **Dynamic content not updating**

   - Check ALB health checks
   - Verify ECS service is running

3. **Cache not invalidating**
   - Use CloudFront invalidation
   - Check cache behavior settings

### Cache Invalidation

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/_next/static/*" "/public/*"
```

## Cost Optimization

- **S3**: Pay per storage and requests
- **CloudFront**: Pay per request and data transfer
- **ALB**: Pay per hour and per request
- **ECS**: Pay per compute time

## Security Considerations

- **Origin Access Identity**: Restricts S3 access to CloudFront only
- **HTTPS**: All viewer requests use HTTPS
- **Security Groups**: ALB restricts traffic to ECS tasks
- **WAF**: Consider adding Web Application Firewall for additional protection
