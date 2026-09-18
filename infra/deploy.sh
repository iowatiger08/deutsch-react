#!/usr/bin/env bash
#
# Build the React app and deploy the static site to S3 + CloudFront.
#
# Prereqs (one-time, see infra/README.md): the S3 bucket, CloudFront
# distribution (with the S3 origin + the Lambda /api/* behavior), ACM cert,
# and Route 53 alias must already exist. This script only publishes new builds.
#
# Config via env vars (or edit the defaults):
#   BUCKET         target S3 bucket name
#   DISTRIBUTION   CloudFront distribution ID (for cache invalidation)
#   AWS_PROFILE    (optional) named AWS profile
#
# Usage:  BUCKET=deutsch-web-123456789012 DISTRIBUTION=E123ABC ./infra/deploy.sh
set -euo pipefail

BUCKET="${BUCKET:?set BUCKET to the target S3 bucket}"
DISTRIBUTION="${DISTRIBUTION:?set DISTRIBUTION to the CloudFront distribution ID}"

here="$(cd "$(dirname "$0")/.." && pwd)"   # the web/ app root
cd "$here"

echo "==> Building (npm ci && npm run build)"
npm ci
npm run build

echo "==> Syncing hashed assets (long cache, immutable)"
# Everything except the entry HTML + service-worker files gets a year-long
# immutable cache — filenames are content-hashed so they never change in place.
aws s3 sync dist "s3://$BUCKET" \
  --delete \
  --exclude "index.html" \
  --exclude "sw.js" \
  --exclude "registerSW.js" \
  --exclude "manifest.webmanifest" \
  --cache-control "public,max-age=31536000,immutable"

echo "==> Uploading entry + service-worker files (no-cache, revalidate)"
# These MUST revalidate so a new deploy is picked up promptly.
for f in index.html sw.js registerSW.js manifest.webmanifest; do
  [ -f "dist/$f" ] || continue
  aws s3 cp "dist/$f" "s3://$BUCKET/$f" \
    --cache-control "no-cache,max-age=0,must-revalidate"
done

echo "==> Invalidating CloudFront ($DISTRIBUTION)"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/index.html" "/sw.js" "/registerSW.js" "/manifest.webmanifest" >/dev/null

echo "==> Done. https://deutsch.tigersndragons.com/"
