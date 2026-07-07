variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1"
}

variable "availability_zone" {
  default = "ap-south-1b"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of an existing EC2 key pair to attach for SSH access"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the instance (lock this down to your own IP)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "project_name" {
  description = "Name prefix used for tagging resources"
  type        = string
  default     = "todo-app"
}
