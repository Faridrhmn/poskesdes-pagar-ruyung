-- =====================================================
-- ALTER TABLE: admins - Add updated_at column
-- =====================================================
-- Run this script if you already have the admins table
-- and need to add the updated_at column
-- =====================================================
-- This script safely adds the updated_at column only if it doesn't exist

-- Check if column exists and add it if it doesn't
-- Note: If column already exists, this will throw an error which you can safely ignore

-- Method 1: Direct ALTER (will error if column exists - you can ignore the error)
ALTER TABLE admins 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Method 2: Using stored procedure (more compatible, but requires procedure creation)
-- Uncomment below if Method 1 doesn't work or you want a safer approach
/*
DELIMITER //
CREATE PROCEDURE AddUpdatedAtColumnIfNotExists()
BEGIN
    DECLARE column_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO column_exists 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'admins' 
    AND COLUMN_NAME = 'updated_at';
    
    IF column_exists = 0 THEN
        ALTER TABLE admins 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
    END IF;
END //
DELIMITER ;

CALL AddUpdatedAtColumnIfNotExists();
DROP PROCEDURE AddUpdatedAtColumnIfNotExists;
*/

-- Verify the changes
SELECT id, username, role, created_at, updated_at FROM admins LIMIT 1;

