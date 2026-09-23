# Infra — S3 + CloudFront + Lambda

Deploys the static React app to **S3 + CloudFront** at
`deutsch.tigersndragons.com`, with a small **Lambda** (behind an **API Gateway
HTTP API**) serving `/api/wetter`, `/api/nachrichten`, and the vocabulary
`/api/entries` API as a second CloudFront origin. Vocabulary lives in a
**DynamoDB** table (`deutsch-entries`), so edits sync across every device. No
EC2, no always-on JVM.

```
infra/
  lambda/handler.mjs   weather + news proxy + /api/entries CRUD (DynamoDB, JWT-gated writes)
  lambda/package.json  fast-xml-parser, aws-jwt-verify (@aws-sdk/client-dynamodb from the runtime)
  deploy.sh            build web/ + s3 sync + CloudFront invalidation
  deploy-lambda.sh     zip + update the Lambda function code
```

### Vocabulary data model (`/api/entries`)

The whole entry array (~1.6k rows, ~200 KB) is stored as a **single DynamoDB
item** (`pk="entries"`, attrs `data` = JSON array string, `updatedAt`, `count`)
— well under the 400 KB item limit, mirroring the client's "whole array in
memory" model. If it ever approaches ~4× today's size, switch to one item per
entry.

- `GET /api/entries` → `{ entries, updatedAt }` — **public** read (the data is
  public by design). The client mirrors the response to IndexedDB for offline.
- `PUT /api/entries` (body `{ entries: [...] }`) → **owner-only**. The Lambda
  verifies the Cognito **ID token** (`aws-jwt-verify` against the pool's JWKS)
  and requires `sub === <allowed owner>`, closing the gap where the edit-lock
  allow-list was only enforced in the browser. Offline edits are queued in the
  client (IndexedDB "dirty" flag) and replayed on reconnect.

Table + IAM (one-time):

```bash
aws dynamodb create-table --table-name deutsch-entries \
  --attribute-definitions AttributeName=pk,AttributeType=S \
  --key-schema AttributeName=pk,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region us-west-2
# grant the Lambda role GetItem/PutItem on the table:
aws iam put-role-policy --role-name <lambda-basic-exec-role> \
  --policy-name deutsch-entries-rw --policy-document '{"Version":"2012-10-17",
  "Statement":[{"Effect":"Allow","Action":["dynamodb:GetItem","dynamodb:PutItem"],
  "Resource":"arn:aws:dynamodb:us-west-2:<account>:table/deutsch-entries"}]}'
```

Seed the item once from a JSON array (`[{german,english,category,sourcePage}]`)
by wrapping it as `{pk:{S:"entries"}, data:{S:<json>}, updatedAt:{S:<iso>},
count:{N:<n>}}` and `aws dynamodb put-item`.

Reuses the existing `tigersndragons.com` setup: hosted zone `Z1WSE25C5PWLRP`,
app region **us-west-2** (CloudFront certs must be in **us-east-1**).

## Live resources

The app is provisioned and live at **https://deutsch.tigersndragons.com/**
(S3 bucket, CloudFront distribution, `deutsch-api` Lambda behind an API Gateway
HTTP API in us-west-2, ACM cert in us-east-1). The concrete account id / bucket /
distribution id / API id / cert ARN are kept out of this public repo — see the
owner's private deployment notes. Deploy with
`BUCKET=<bucket> DISTRIBUTION=<dist-id> ./infra/deploy.sh`.

**Note — why API Gateway, not a Lambda Function URL:** this account's guardrails
block invoking a Function URL both anonymously (`AuthType NONE` → 403) *and* via
the CloudFront service principal (OAC signing → `AccessDenied`). A direct SigV4
call with an IAM user succeeds, confirming the guardrail is on the service
principal. So the Lambda sits behind a public **API Gateway HTTP API** ($default
proxy route), which CloudFront fronts as a plain custom origin (no OAC).

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

# Front it with a public API Gateway HTTP API ($default proxy route). Quick-create
# wires the integration, $default stage, and (usually) the invoke permission:
aws apigatewayv2 create-api --name deutsch-api-http --protocol-type HTTP \
  --target arn:aws:lambda:us-west-2:$ACCOUNT:function:deutsch-api --region us-west-2
# If API GW returns 500 with no Lambda invocation, add the invoke permission:
aws lambda add-permission --function-name deutsch-api --statement-id apigw-invoke \
  --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:us-west-2:$ACCOUNT:<api-id>/*/*" --region us-west-2
```

Smoke-test the public API endpoint directly:
`curl https://<api-id>.execute-api.us-west-2.amazonaws.com/api/wetter`
(the handler reads `requestContext.http.path`, which the HTTP API 2.0 payload
provides, so it needs no changes).

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
- **Second origin**: the **API Gateway** host
  (`<api-id>.execute-api.us-west-2.amazonaws.com`, origin type = custom,
  HTTPS-only). It's a public endpoint, so **no OAC** — CloudFront just proxies.
- **Default behavior** → S3 origin. Cache: hashed assets `immutable`;
  `index.html` / `sw.js` short TTL (the deploy script sets these headers).
- **`/api/*` behavior** → the API Gateway origin; caching disabled (managed
  `CachingDisabled` + `AllViewerExceptHostHeader`) so `/api/wetter` /
  `/api/nachrichten` / `/api/entries` reach the function. (The SW also
  NetworkFirst-caches these for offline.) **AllowedMethods must include the
  write verbs** (GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE) — otherwise a
  `PUT /api/entries` is rejected by CloudFront as a disallowed method and the
  `403 → /index.html` SPA fallback masks it as a 200 HTML page.
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
- `GET /api/entries` returns the full array; a **signed-in** owner can add/edit
  and see it persist across a hard reload and on a second device.
- `PUT /api/entries` without a valid owner token returns **401 JSON** (not the
  SPA HTML — confirms CloudFront forwards write methods to the function).
- Install the PWA and relaunch **offline**: search / quiz / grammar work; Wetter
  and vocabulary show the last-cached data.
