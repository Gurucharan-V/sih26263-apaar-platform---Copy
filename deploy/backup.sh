#!/bin/bash
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
DB_NAME=${DB_NAME:-apaar}
DB_USER=${DB_USER:-apaar_user}

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting PostgreSQL database backup for SIH 26263 APAAR platform..."
pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -b -v -f "$BACKUP_DIR/apaar_db_$TIMESTAMP.dump"

echo "[$(date)] Syncing uploaded documents from MinIO/S3..."
# S3 sync command if aws-cli or mc is available
# mc mirror local/uploads "$BACKUP_DIR/s3_$TIMESTAMP"

echo "[$(date)] Backup completed successfully: $BACKUP_DIR/apaar_db_$TIMESTAMP.dump"
