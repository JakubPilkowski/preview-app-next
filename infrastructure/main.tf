terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "PLACEHOLDER_S3_BUCKET"
    key            = "preview/next-app/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "PLACEHOLDER_DYNAMODB_TABLE"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# Provider for WAF v2 (must be in us-east-1 for CloudFront)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Data source for existing CloudFront distribution
data "aws_cloudfront_distribution" "next_app" {
  id = var.next_app_cloudfront_id
}

# Data source for existing ALB
data "aws_lb" "existing" {
  arn = "arn:aws:elasticloadbalancing:${var.aws_region}:${var.aws_account_id}:loadbalancer/app/${var.alb_name}/${var.alb_id}"
}

# Data source for existing target group
data "aws_lb_target_group" "next_app" {
  name = var.target_group_name
}

# Update CloudFront cache behavior for API routes
resource "aws_cloudfront_cache_behavior" "next_app_api" {
  distribution_id    = data.aws_cloudfront_distribution.next_app.id
  path_pattern       = "/api/*"
  target_origin_id   = "ALB-DynamicContent"
  
  cache_policy_id         = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
  
  viewer_protocol_policy = "allow-all"
  allowed_methods       = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
  cached_methods        = ["GET", "HEAD"]
}

# Data source for existing ALB listener
data "aws_lb_listener" "existing" {
  load_balancer_arn = data.aws_lb.existing.arn
  port              = 80
}
