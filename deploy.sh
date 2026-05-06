#!/bin/bash
set -e

if [ ! -f .env ]; then
  echo "Error: .env file not found"
  exit 1
fi

# Load .env
set -a
source .env
set +a

# Build --build-env-vars string from all VITE_ vars in .env
BUILD_ENV_VARS=$(grep -v '^#' .env | grep '^VITE_' | xargs | tr ' ' ',')

gcloud run deploy taxtrack \
  --source . \
  --project taxtrack-495412 \
  --region asia-south1 \
  --allow-unauthenticated \
  --build-env-vars "$BUILD_ENV_VARS"
