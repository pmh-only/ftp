# Deployment Guide

This guide provides instructions for building, installing, and deploying ftp.io.kr components.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Building Components](#building-components)
- [Container Images](#container-images)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloudflare Worker Deployment](#cloudflare-worker-deployment)

## Prerequisites

### Development Tools

- **Go**: Version 1.25.4 or higher (for indexer and statcat)
- **Node.js**: Version 25 or higher (for frontend and healthz)
- **pnpm**: Version 10 or higher (for frontend)
- **Docker**: Latest version with buildx support
- **kubectl**: Latest version (for Kubernetes deployment)
- **Helm**: Version 3.x (for Kubernetes deployment)
- **wrangler**: Latest version (for Cloudflare Worker deployment)

### Infrastructure Requirements

- **Kubernetes Cluster**: For deploying core services
- **Cloudflare Account**: For deploying healthz worker
- **Container Registry**: GitHub Container Registry (ghcr.io) or equivalent
- **Persistent Storage**: For package storage and syncing
- **DNS Provider**: For managing A/AAAA records (can be managed by healthz)

## Local Development

### Frontend

The frontend is a React application built with Vite and TypeScript.

```bash
cd frontend
pnpm install
pnpm dev        # Start development server
pnpm build      # Build for production
```

### Indexer

The indexer is a Go application that renders directory listings.

```bash
cd indexer
go mod download
go build -o indexer .
./indexer
```

### Statcat

Statcat is a Go application for collecting bandwidth metrics.

```bash
cd statcat
go mod download
go build -o statcat .
./statcat hub    # Run in hub mode
./statcat spoke  # Run in spoke mode
```

### Healthz

Healthz is a Cloudflare Worker that monitors node health.

```bash
cd healthz
npm install -g wrangler  # Install wrangler globally if not already installed
wrangler dev --test-scheduled  # Start local development
```

## Building Components

### Building Go Components

#### Indexer

```bash
cd indexer
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o indexer-amd64
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o indexer-arm64
```

#### Statcat

```bash
cd statcat
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o statcat-amd64
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o statcat-arm64
```

### Building Frontend

```bash
cd frontend
pnpm install
pnpm build
# Output will be in frontend/dist/
```

## Container Images

All components are containerized using Docker and pushed to GitHub Container Registry (ghcr.io). The build process is automated via GitHub Actions.

### Manual Docker Build

#### Indexer

```bash
cd indexer
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o main-amd64
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o main-arm64

docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/indexer:latest \
  --push .
```

#### Webserver (includes frontend)

```bash
cd frontend
pnpm install
pnpm build
cp -r dist/ ../webserver/dist/

cd ../webserver
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/webserver:latest \
  --push .
```

#### Syncrepo

```bash
cd syncrepo
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/syncrepo:latest \
  --push .
```

#### FTP Server

```bash
cd ftpserver
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/ftpserver:latest \
  --push .
```

#### Rsync Server

```bash
cd rsyncserver
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/rsyncserver:latest \
  --push .
```

#### Statcat

```bash
cd statcat
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags "-s -w" -o main-amd64
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags "-s -w" -o main-arm64

docker buildx build --platform linux/amd64,linux/arm64 \
  -t ghcr.io/pmh-only/statcat:latest \
  --push .
```

#### Bwlimit

The bwlimit component has multiple Docker images:

```bash
cd bwlimit

# Build pmacct image
docker buildx build --platform linux/amd64,linux/arm64 \
  -f Dockerfile.pmacct \
  -t ghcr.io/pmh-only/bwlimit-pmacct:latest \
  --push .

# Build nfdump image
docker buildx build --platform linux/amd64,linux/arm64 \
  -f Dockerfile.nfdump \
  -t ghcr.io/pmh-only/bwlimit-nfdump:latest \
  --push .

# Build nfdump-ban image
docker buildx build --platform linux/amd64,linux/arm64 \
  -f Dockerfile.nfdump-ban \
  -t ghcr.io/pmh-only/bwlimit-ban:latest \
  --push .
```

### Automated Builds with GitHub Actions

All components have automated build workflows in `.github/workflows/`. Pushing changes to the `main` branch triggers automatic builds:

- `build_indexer.yaml` - Builds indexer component
- `build_webserver.yaml` - Builds frontend and webserver
- `build_syncrepo.yaml` - Builds syncrepo component
- `build_ftpserver.yaml` - Builds FTP server
- `build_rsyncserver.yaml` - Builds rsync server
- `build_statcat.yaml` - Builds statcat component
- `build_bwlimit.yaml` - Builds bwlimit components

Workflows can also be triggered manually via `workflow_dispatch`.

## Kubernetes Deployment

The infrastructure is managed using Kubernetes manifests and Helm charts located in the `infra/` directory. The deployment follows GitOps principles using ArgoCD.

### Prerequisites

1. A running Kubernetes cluster
2. kubectl configured to access your cluster
3. Helm 3.x installed
4. ArgoCD installed (optional but recommended for GitOps)

### Deployment Architecture

Components are organized into several categories:

- **Core Components**: `infra/core/` - Contains webserver, syncrepo, indexer, ftpserver, rsyncserver
- **Common Resources**: `infra/core_commons/` - Shared resources like secrets, certificates, services
- **Monitoring**: `infra/statcat/` - Bandwidth monitoring components
- **Security**: `infra/bwlimit/` - Traffic monitoring and abuse prevention
- **Applications**: `infra/apps/` - ArgoCD application definitions
- **Networking**: `infra/net/` - Network policies and configurations

### Step-by-Step Deployment

#### 1. Configure Secrets

Create necessary secrets for container registry access:

```bash
# Create GitHub Container Registry secret
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<your-github-username> \
  --docker-password=<your-github-token> \
  --namespace=<your-namespace>

# If using Cloudflare for DNS
kubectl create secret generic cloudflare-secret \
  --from-literal=api-token=<your-cloudflare-token> \
  --namespace=<your-namespace>
```

#### 2. Deploy Common Resources

```bash
cd infra
kubectl apply -f core_commons/
```

#### 3. Deploy Core Components

```bash
# Apply core manifests
kubectl apply -f core/
```

#### 4. Deploy Helm Charts

Deploy components that use Helm charts:

```bash
# Deploy bwlimit
cd infra/bwlimit
helm install bwlimit . -f values.yaml

# Deploy statcat
cd ../statcat
helm install statcat . -f values.yaml
```

#### 5. Verify Deployment

```bash
# Check pod status
kubectl get pods -n <your-namespace>

# Check services
kubectl get svc -n <your-namespace>

# Check logs
kubectl logs -f <pod-name> -n <your-namespace>
```

### Using ArgoCD (Recommended)

For GitOps-based deployment using ArgoCD:

#### 1. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

#### 2. Deploy Application Definitions

```bash
cd infra/apps
kubectl apply -f .
```

#### 3. Configure Image Updater

The `infra/image_updater_conf/` directory contains configuration for automated image updates:

```bash
kubectl apply -f infra/image_updater_conf/
```

ArgoCD will monitor the Git repository and automatically sync changes, implementing the single-source-of-truth approach described in the architecture.

### Storage Configuration

Ensure persistent volumes are configured for:

- **Package Storage**: Shared volume for syncrepo, webserver, ftpserver, rsyncserver, indexer
- **Configuration**: ConfigMaps for component configurations

### Network Configuration

Configure appropriate services and ingress:

```bash
kubectl apply -f infra/net/
```

For production deployment, ensure:
- Load balancer is properly configured
- TLS certificates are provisioned (cert-manager recommended)
- Health check endpoints are accessible

## Cloudflare Worker Deployment

The healthz component runs as a Cloudflare Worker to monitor node health and update DNS records.

### Prerequisites

1. Cloudflare account with API token
2. Domain configured in Cloudflare
3. wrangler CLI installed

### Configuration

1. Configure wrangler authentication:

```bash
wrangler login
```

2. Update `healthz/wrangler.toml` with your configuration:

```toml
name = "healthz"
main = "src/index.ts"
compatibility_date = "2025-01-16"

# Configure scheduled events
[triggers]
crons = ["*/5 * * * *"]  # Run every 5 minutes

# Environment variables
[vars]
NODES = "[\"node1.ftp.io.kr\", \"node2.ftp.io.kr\"]"
DOMAIN = "ftp.io.kr"

# Secrets (set via wrangler secret put)
# CLOUDFLARE_API_TOKEN
# CLOUDFLARE_ZONE_ID
```

3. Set secrets:

```bash
cd healthz
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put CLOUDFLARE_ZONE_ID
```

### Deploy to Cloudflare

```bash
cd healthz
wrangler deploy
```

### Testing

Test the worker locally:

```bash
wrangler dev --test-scheduled
```

Trigger the scheduled event manually:

```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

## Post-Deployment Verification

### 1. Health Checks

Verify all components are running:

```bash
# Check Kubernetes pods
kubectl get pods -A

# Check webserver health
curl https://your-domain.com/healthz

# Check syncrepo last sync time
curl https://your-domain.com/lastsync
```

### 2. Service Verification

Test each service:

```bash
# Test HTTP/HTTPS
curl https://your-domain.com/

# Test FTP
curl ftp://your-domain.com/

# Test rsync
rsync rsync://your-domain.com/
```

### 3. Monitoring

- Check statcat metrics are being collected
- Verify bwlimit is monitoring traffic
- Ensure healthz is updating DNS records
- Monitor ArgoCD sync status (if using GitOps)

## Troubleshooting

### Component Not Starting

```bash
# Check pod logs
kubectl logs <pod-name> -n <namespace>

# Check pod events
kubectl describe pod <pod-name> -n <namespace>

# Check resource constraints
kubectl top pods -n <namespace>
```

### Sync Issues

```bash
# Check syncrepo logs
kubectl logs -l app=syncrepo -n <namespace>

# Verify storage is mounted
kubectl exec -it <syncrepo-pod> -- df -h
```

### Frontend Not Loading

```bash
# Check if assets are served correctly
curl https://your-domain.com/

# Verify webserver configuration
kubectl exec -it <webserver-pod> -- nginx -T
```

### DNS Issues

```bash
# Check healthz worker logs in Cloudflare dashboard
# Verify DNS records are being updated
dig your-domain.com
```

## Scaling

### Horizontal Scaling

Cattle components can be scaled horizontally:

```bash
# Scale webserver
kubectl scale deployment webserver --replicas=5

# Scale indexer
kubectl scale deployment indexer --replicas=3
```

### Vertical Scaling

Adjust resource limits in Kubernetes manifests:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## Maintenance

### Updating Components

1. Push changes to GitHub
2. GitHub Actions builds new container images
3. ArgoCD Image Updater detects new images
4. ArgoCD automatically updates deployments (if auto-sync enabled)

Or manually update:

```bash
# Update specific component
kubectl set image deployment/webserver webserver=ghcr.io/pmh-only/webserver:latest
```

### Backup and Recovery

Regular backups should include:
- Package storage persistent volumes
- Kubernetes manifests and Helm values
- Configuration secrets
- DNS records

## Security Considerations

1. **Container Registry**: Use private registries and scan images for vulnerabilities
2. **Secrets Management**: Never commit secrets to Git; use Kubernetes secrets or external secret managers
3. **Network Policies**: Implement network policies to restrict inter-pod communication
4. **TLS**: Always use TLS for public-facing services
5. **Access Control**: Use RBAC for Kubernetes access
6. **Abuse Prevention**: Ensure bwlimit is properly configured to block malicious traffic

## Support

For issues and questions:
- Check component logs
- Review GitHub Issues: https://github.com/pmh-only/ftp/issues
- Contact: pmh_only@pmh.codes
