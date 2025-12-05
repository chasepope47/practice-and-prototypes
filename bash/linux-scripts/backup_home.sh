#!/usr/bin/env bash
# Simple home directory backup (demo)
# Usage: ./backup_home.sh /path/to/backup/dir

set -e

BACKUP_DIR="${1:-$HOME/backups}"
TIMESTAMP="$(date =%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/home-backup-$TIMESTAMP.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating backup at: $DEST"
tar - czf "$DEST" "$HOME"

echo "Backup complete."