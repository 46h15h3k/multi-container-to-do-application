# Multi-Container Application

A production-style deployment pipeline for a simple Todo List REST API, built to
demonstrate end-to-end DevOps practice: containerizing a multi-service app,
provisioning cloud infrastructure as code, configuring it with Ansible, and
automating deployment with GitHub Actions.

## What this demonstrates

- **Containerization** — Node.js/Express API + MongoDB orchestrated with Docker Compose, with persistent data volumes and separate dev/prod configurations.
- **Infrastructure as Code** — Terraform provisions an AWS EC2 instance (Amazon Linux 2023) with a security group scoped to only the ports the app needs.
- **Configuration Management** — Ansible installs Docker and the Compose plugin, templates the production compose file, and starts the stack — written to work across AL2023 (`dnf`) and Debian/Ubuntu (`apt`) hosts.
- **CI/CD** — GitHub Actions builds the image, pushes it to Docker Hub, and deploys to the remote server over SSH on every push to `main`.
- **Reverse proxy** — Nginx sits in front of the API so the app is reachable on port 80 under a domain name, not a raw app port.

## Architecture

```
               GitHub push → GitHub Actions → Docker Hub (image)
                                       │
                                       ▼
                EC2 (Terraform-provisioned, Ansible-configured)
                    ┌─────────────────────────────────────┐
                    │  Nginx :80  →  API :3000  →  Mongo  │
                    │      (docker-compose.prod.yml)      │
                    └─────────────────────────────────────┘
```

## API Endpoints

| Method | Route         | Description          |
|--------|---------------|----------------------|
| GET    | `/todos`      | List all todos       |
| POST   | `/todos`      | Create a new todo     |
| GET    | `/todos/:id`  | Get a single todo    |
| PUT    | `/todos/:id`  | Update a single todo  |
| DELETE | `/todos/:id`  | Delete a single todo |
| GET    | `/health`     | Health check (used for readiness) |

No authentication

## Running locally

```bash
git clone <this-repo>
cd todo-app
docker compose up --build
```

The API is available at `http://localhost:3000`. `nodemon` watches `./src` for
changes and restarts the server automatically. MongoDB data persists in the
`mongo-data` named volume across `docker compose down` / `up` cycles (use
`docker compose down -v` if you want a clean slate).

Quick smoke test:

```bash
curl -X POST http://localhost:3000/todos -H "Content-Type: application/json" -d '{"title":"Ship the project"}'
curl http://localhost:3000/todos
```

## Deploying to AWS

### 1. Provision the server (Terraform)

```bash
cd terraform
terraform init
terraform apply -var="key_name=your-existing-keypair-name"
```

Note the `instance_public_ip` output — you'll need it for Ansible and the
GitHub Actions secrets.

### 2. Configure the server (Ansible)

Update `ansible/inventory.ini` with the IP from Terraform and your SSH key
path, then:

```bash
cd ansible
DOCKERHUB_USERNAME=your-dockerhub-username ansible-playbook -i inventory.ini playbook.yml
```

This installs Docker + the Compose plugin, templates the production
`docker-compose.yml`, and brings the stack up.

### 3. Continuous deployment (GitHub Actions)

Add these repository secrets:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | A Docker Hub access token |
| `SERVER_HOST` | EC2 public IP from Terraform output |
| `SERVER_USER` | `ec2-user` |
| `SERVER_SSH_KEY` | Private key content for SSH access |

Every push to `main` builds the image, pushes it to Docker Hub, and
redeploys it on the server via `docker compose pull && up -d`.

## Project structure

```
.
├── src/                        # Express API source
├── Dockerfile
├── docker-compose.yml          # local development (nodemon, bind mounts)
├── docker-compose.prod.yml     # production (pulled image, Nginx, no mounts)
├── nginx/nginx.conf            # reverse proxy config
├── terraform/                  # AWS infra as code
├── ansible/                    # server provisioning + app deployment
└── .github/workflows/deploy.yml
```

## Skills demonstrated

`Docker` · `Docker Compose` · `Node.js/Express` · `MongoDB/Mongoose` ·
`Terraform` · `Ansible` · `GitHub Actions (CI/CD)` · `Nginx` · `AWS EC2`
