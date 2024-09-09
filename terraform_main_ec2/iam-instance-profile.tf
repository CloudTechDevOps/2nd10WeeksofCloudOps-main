resource "aws_iam_instance_profile" "instance-profile" {
  name = "naresh-veera-profile"
  role = aws_iam_role.iam-role.name
}
