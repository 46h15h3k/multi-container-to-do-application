output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.todo_app_server.public_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.todo_app_server.id
}

output "ssh_command" {
  description = "Handy SSH command to connect to the instance"
  value       = "ssh -i <path-to-your-key>.pem ec2-user@${aws_instance.todo_app_server.public_ip}"
}
