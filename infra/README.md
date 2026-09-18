# Infra — S3 + CloudFront + Lambda

Deploys the static React app to **S3 + CloudFront** at
`deutsch.tigersndragons.com`, with a small **Lambda** (behind a Function URL)
serving `/api/wetter` and `/api/nachrichten` as a second CloudFront origin. No
EC2, no always-on JVM.

```
infra/
  lambda/handler.mjs   weather + news proxy (ports WeatherService + NewsService)
  lambda/package.json  fast-xml-parser
  deploy.sh            build web/ + s3 sync + CloudFront invalidation
  deploy-lambda.sh     zip + update the Lambda function code
```

Reuses the existing `tigersndragons.com` setup: hosted zone `Z1WSE25C5PWLRP`,
app region **us-west-2** (CloudFront certs must be in **us-east-1**).

---

## One-time setup

Values to pick first: `ACCOUNT` (your AWS account id), `BUCKET`
(e.g. `deutsch-web-$ACCOUNT`), region `us-west-2`.

### 1. Lambda (weather + news)

```bash
cd infra/lambda && npm ci --omit=dev
zip -qr /tmp/deutsch-api.zip handler.mjs package.json node_modules

aws lambda create-function \
  --function-name deutsch-api \
  --runtime nodejs22.x --handler handler.handler \
  --zip-file fileb:///tmp/deutsch-api.zip \
  --role arn:aws:iam::$ACCOUNT:role/<lambda-basic-exec-role> \
  --timeout 15 --memory-size 256 --region us-west-2

# Public Function URL (CloudFront fronts it; no auth on the URL itself)
aws lambda create-function-url-config \
  --function-name deutsch-api --auth-type NONE --region us-west-2
aws lambda add-permission --function-name deutsch-api \
  --statement-id fnurl --action lambda:InvokeFunctionUrl \
  --principal '*' --function-url-auth-type NONE --region us-west-2
```

Smoke-test: `curl <function-url>/api/wetter` and `.../api/nachrichten`.

### 2. S3 bucket (private, served only via CloudFront/OAC)

```bash
aws s3api create-bucket --bucket $BUCKET \
  --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2
aws s3api put-public-access-block --bucket $BUCKET \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

### 3. ACM certificate (must be us-east-1 for CloudFront)

```bash
aws acm request-certificate --region us-east-1 \
  --domain-name deutsch.tigersndragons.com --validation-method DNS
```

Add the returned CNAME to zone `Z1WSE25C5PWLRP` and wait for `ISSUED`.

### 4. CloudFront distribution

- **Default origin**: the S3 bucket via **Origin Access Control (OAC)**; then
  attach the generated bucket policy so only this distribution can read it.
- **Second origin**: the Lambda **Function URL** host (origin type = custom,
  HTTPS-only).
- **Default behavior** → S3 origin. Cache: hashed assets `immutable`;
  `index.html` / `sw.js` short TTL (the deploy script sets these headers).
- **`/api/*` behavior** → the Lambda origin; disable caching (or very short TTL)
  and forward the request path so `/api/wetter` / `/api/nachrichten` reach the
  function. (The SW also NetworkFirst-caches these for offline.)
- **Alternate domain**: `deutsch.tigersndragons.com` + the ACM cert.
- **SPA fallback**: custom error responses map **403 and 404 → `/index.html`**
  (200) so client-side routes deep-link and refresh without 404.

### 5. Route 53 alias

Alias `A` (and `AAAA`) for `deutsch.tigersndragons.com` → the distribution, in
zone `Z1WSE25C5PWLRP`.

---

## Deploying updates

```bash
# Static site (build + sync + invalidate)
BUCKET=$BUCKET DISTRIBUTION=<dist-id> ./infra/deploy.sh

# Lambda code
FUNCTION=deutsch-api REGION=us-west-2 ./infra/deploy-lambda.sh
```

## Verify (prod smoke test)

- `https://deutsch.tigersndragons.com/` loads with a valid cert (phone + laptop).
- Deep-link `/grammar` refreshes without 404 (SPA fallback).
- `/api/wetter` returns via CloudFront; Wetter page shows live data.
- Install the PWA and relaunch **offline**: search / quiz / grammar work; Wetter
  shows the last-cached data.
