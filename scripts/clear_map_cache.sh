#!/bin/bash
set -e

echo "Clearing map cache..."

curl -s -X POST http://localhost:3000/api/admin/clear-cache \
  -H "Content-Type: application/json" | jq .

echo "✓ Map cache cleared"
