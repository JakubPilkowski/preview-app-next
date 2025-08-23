output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = data.aws_cloudfront_distribution.next_app.id
}

output "cloudfront_domain_name" {
  description = "CloudFront Domain Name"
  value       = data.aws_cloudfront_distribution.next_app.domain_name
}

output "alb_domain_name" {
  description = "ALB Domain Name"
  value       = data.aws_lb.existing.dns_name
}

output "target_group_arn" {
  description = "Target Group ARN"
  value       = data.aws_lb_target_group.next_app.arn
}

