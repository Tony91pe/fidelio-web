#!/bin/bash
set -e

LAT=$1
LNG=$2

if [ -z "$LAT" ] || [ -z "$LNG" ]; then
  echo "Usage: $0 <latitude> <longitude>"
  exit 1
fi

echo "Listing stores around $LAT,$LNG..."

curl -s "http://localhost:3000/api/app/stores-map?lat=$LAT&lng=$LNG&radius=50" | jq .

echo "✓ Stores retrieved"
