#!/usr/bin/env python3
"""
Database Migration Script: cms-serv1db.db → cms.db

Migrates all data from the source database (real client data) to the target database
(which has new columns with mock data). Only migrates tables that exist in both databases.
New columns in target keep their default values.
"""

import sqlite3
import shutil
from datetime import datetime
from pathlib import Path

# Configuration
SOURCE_DB = "cms-serv1db.db"
TARGET_DB = "cms.db"
BACKUP_PREFIX = "cms_backup"

def create_backup(target_db: str) -> str:
    """Create a timestamped backup of the target database."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"{BACKUP_PREFIX}_{timestamp}.db"
    shutil.copy2(target_db, backup_name)
    print(f"✓ Backup created: {backup_name}")
    return backup_name

def get_tables(conn: sqlite3.Connection) -> list:
    """Get list of all tables in the database (excluding sqlite internals)."""
    cursor = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    )
    return [row[0] for row in cursor.fetchall()]

def get_columns(conn: sqlite3.Connection, table: str) -> list:
    """Get list of column names for a table."""
    cursor = conn.execute(f"PRAGMA table_info({table})")
    return [row[1] for row in cursor.fetchall()]

def get_row_count(conn: sqlite3.Connection, table: str) -> int:
    """Get row count for a table."""
    cursor = conn.execute(f"SELECT COUNT(*) FROM {table}")
    return cursor.fetchone()[0]

def migrate_table(source_conn: sqlite3.Connection, target_conn: sqlite3.Connection, 
                  table: str, source_cols: list, target_cols: list) -> tuple:
    """
    Migrate data from source table to target table.
    Returns (source_count, migrated_count).
    """
    # Find common columns
    common_cols = [col for col in source_cols if col in target_cols]
    
    if not common_cols:
        return (0, 0)
    
    cols_str = ", ".join(common_cols)
    placeholders = ", ".join(["?" for _ in common_cols])
    
    # Get source data
    source_cursor = source_conn.execute(f"SELECT {cols_str} FROM {table}")
    rows = source_cursor.fetchall()
    source_count = len(rows)
    
    # Clear target table
    target_conn.execute(f"DELETE FROM {table}")
    
    # Insert data into target
    if rows:
        target_conn.executemany(
            f"INSERT INTO {table} ({cols_str}) VALUES ({placeholders})",
            rows
        )
    
    target_conn.commit()
    
    # Verify count
    migrated_count = get_row_count(target_conn, table)
    
    return (source_count, migrated_count)

def main():
    print("=" * 60)
    print("Database Migration: cms-serv1db.db → cms.db")
    print("=" * 60)
    print()
    
    # Create backup
    backup_file = create_backup(TARGET_DB)
    print()
    
    # Connect to databases
    source_conn = sqlite3.connect(SOURCE_DB)
    target_conn = sqlite3.connect(TARGET_DB)
    
    # Get tables from both databases
    source_tables = set(get_tables(source_conn))
    target_tables = set(get_tables(target_conn))
    
    # Find common tables
    common_tables = sorted(source_tables & target_tables)
    
    print(f"Source tables: {len(source_tables)}")
    print(f"Target tables: {len(target_tables)}")
    print(f"Common tables: {len(common_tables)}")
    print()
    
    # Tables only in source (will not be migrated)
    source_only = source_tables - target_tables
    if source_only:
        print(f"⚠ Tables only in source (not migrated): {sorted(source_only)}")
        print()
    
    # Tables only in target (will be preserved)
    target_only = target_tables - source_tables
    if target_only:
        print(f"ℹ Tables only in target (preserved): {sorted(target_only)}")
        print()
    
    # Migration results
    results = []
    total_source = 0
    total_migrated = 0
    
    print("Migrating tables...")
    print("-" * 60)
    
    for table in common_tables:
        source_cols = get_columns(source_conn, table)
        target_cols = get_columns(target_conn, table)
        
        source_count, migrated_count = migrate_table(
            source_conn, target_conn, table, source_cols, target_cols
        )
        
        status = "✓" if source_count == migrated_count else "✗"
        results.append((table, source_count, migrated_count, status))
        
        total_source += source_count
        total_migrated += migrated_count
        
        print(f"  {status} {table}: {source_count} → {migrated_count}")
    
    print("-" * 60)
    print()
    
    # Summary
    print("=" * 60)
    print("VERIFICATION REPORT")
    print("=" * 60)
    print()
    print(f"{'Table':<40} {'Source':>8} {'Target':>8} {'Status':>8}")
    print("-" * 60)
    
    for table, src, tgt, status in results:
        print(f"{table:<40} {src:>8} {tgt:>8} {status:>8}")
    
    print("-" * 60)
    print(f"{'TOTAL':<40} {total_source:>8} {total_migrated:>8}")
    print()
    
    # Final status
    all_match = all(r[1] == r[2] for r in results)
    if all_match:
        print("✓ MIGRATION SUCCESSFUL - All rows verified!")
    else:
        print("✗ MIGRATION WARNING - Some rows may not have migrated correctly!")
        mismatches = [(r[0], r[1], r[2]) for r in results if r[1] != r[2]]
        for table, src, tgt in mismatches:
            print(f"  - {table}: expected {src}, got {tgt}")
    
    print()
    print(f"Backup saved as: {backup_file}")
    
    # Close connections
    source_conn.close()
    target_conn.close()

if __name__ == "__main__":
    main()
