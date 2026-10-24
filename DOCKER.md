# Running KYC-Jordan with Docker

The image builds the Vite app and serves it with nginx on port `8080`
(or `$PORT` if set, e.g. on Cloud Run). Health check: `GET /healthz`.

## Image on Docker Hub

`.github/workflows/docker-publish.yml` builds the image on every pull request
and, on every push to `main`, pushes it to Docker Hub as:

- `<DOCKERHUB_USERNAME>/kyc-jordan:latest`
- `<DOCKERHUB_USERNAME>/kyc-jordan:<commit sha>`

One-time setup (GitHub repo → Settings → Secrets and variables → Actions):

| Secret               | Value                                                        |
| -------------------- | ------------------------------------------------------------ |
| `DOCKERHUB_USERNAME` | your Docker Hub username                                     |
| `DOCKERHUB_TOKEN`    | Docker Hub personal access token with Read & Write access    |

To publish without a new commit: Actions → Docker image → Run workflow.

## Run on a GCP VM

```bash
docker pull <DOCKERHUB_USERNAME>/kyc-jordan:latest
docker run -d --name kyc-jordan --restart unless-stopped \
  -p 80:8080 <DOCKERHUB_USERNAME>/kyc-jordan:latest
```

Open `http://<VM external IP>/`. The VM firewall must allow inbound TCP 80
(tick "Allow HTTP traffic" on the VM, or add a firewall rule).

Update to the latest image:

```bash
docker pull <DOCKERHUB_USERNAME>/kyc-jordan:latest
docker rm -f kyc-jordan
docker run -d --name kyc-jordan --restart unless-stopped \
  -p 80:8080 <DOCKERHUB_USERNAME>/kyc-jordan:latest
```

## Run on Cloud Run

```bash
gcloud run deploy kyc-jordan \
  --image docker.io/<DOCKERHUB_USERNAME>/kyc-jordan:latest \
  --port 8080 --allow-unauthenticated --region <region>
```

## Build locally

```bash
docker build -t kyc-jordan .
docker run --rm -p 8080:8080 kyc-jordan
```
