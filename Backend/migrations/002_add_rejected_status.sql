-- REQUIRED for Reject purchase to mark status as 'rejected' (keeps audit trail).
-- Run this if reject fails with: Data truncated for column 'status'

ALTER TABLE purchase
  MODIFY COLUMN status ENUM('draft', 'completed', 'rejected') NOT NULL DEFAULT 'draft';
