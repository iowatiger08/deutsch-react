#!/usr/bin/env bash
#
# Package and update the weather/news Lambda from infra/lambda/.
# Creates a zip of handler.mjs + node_modules and pushes it to an existing
# function. Create the function once via the console/CLI (see README), then
# use this to ship new code.
#
# Config:
#   FUNCTION   Lambda function name (default: deutsch-api)
#   REGION     AWS region (default: us-west-2)
set -euo pipefail

FUNCTION="${FUNCTION:-deutsch-api}"
REGION="${REGION:-us-west-2}"

here="$(cd "$(dirname "$0")/lambda" && pwd)"
cd "$here"

echo "==> Installing production deps"
npm ci --omit=dev

echo "==> Zipping"
zip -qr /tmp/deutsch-api.zip handler.mjs package.json node_modules

echo "==> Updating function code ($FUNCTION in $REGION)"
aws lambda update-function-code \
  --function-name "$FUNCTION" \
  --zip-file fileb:///tmp/deutsch-api.zip \
  --region "$REGION" >/dev/null

echo "==> Done. Test via API Gateway:  curl https://<api-id>.execute-api.$REGION.amazonaws.com/api/wetter"
