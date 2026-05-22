output "cluster_name" {
  description = "EKS cluster name."
  value       = aws_eks_cluster.eks_cluster.name
}

output "cluster_endpoint" {
  description = "EKS cluster endpoint."
  value       = aws_eks_cluster.eks_cluster.endpoint
}

output "node_group_name" {
  description = "EKS node group name."
  value       = aws_eks_node_group.nodegrpoup.node_group_name
}

