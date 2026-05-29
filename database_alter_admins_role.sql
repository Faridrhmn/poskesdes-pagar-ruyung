-- =====================================================
-- ALTER TABLE: admins - Add role column
-- =====================================================
-- Run this script if you already have the admins table
-- and need to add the role column
-- =====================================================

-- Add role column if not exists
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS role ENUM('superadmin', 'regular') DEFAULT 'regular' AFTER password_hash;

-- Add index for role column
CREATE INDEX IF NOT EXISTS idx_role ON admins(role);

-- Update existing admin to superadmin (optional - update based on your needs)
-- UPDATE admins SET role = 'superadmin' WHERE username = 'admin';

-- Verify the changes
SELECT id, username, role, created_at FROM admins;

