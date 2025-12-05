#!/usr/bin/env bash
# Very simple ping sweep for a /24 network you OWN or have permission to test.
# Usage: ./ping_sweep.sh 192.168.0

if [ -z "$1" ]; then
  echo "Usage: $0 <first-three-octets>   e.g.  $0 192.168.0"
  exit 1
fi

BASE="$1"

for i in {1..254}; do
  IP="$BASE.$i"
  ping -c 1 -W 1 "$IP" &>/dev/null && echo "Host up: $IP"
done
