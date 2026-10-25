#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <path_to_dump_file>"
    exit 1
fi

DUMP_FILE="$1"
DB_NAME=${DB_NAME:-apaar}
DB_USER=${DB_USER:-apaar_user}

echo "[$(date)] Restoring database $DB_NAME from $DUMP_FILE..."
pg_restore -U "$DB_USER" -d "$DB_NAME" -v --clean "$DUMP_FILE"

echo "[$(date)] Database restoration finished successfully!"
