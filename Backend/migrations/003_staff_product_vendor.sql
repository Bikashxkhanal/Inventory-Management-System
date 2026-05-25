-- Run once. Required for product/vendor soft-delete and staff join-date filters.
-- If a column already exists, skip that statement or comment it out.

ALTER TABLE sys_user
  ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE product
  ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'active';

ALTER TABLE product
  ADD COLUMN created_by INT NULL;

ALTER TABLE vendor
  ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'active';

ALTER TABLE vendor
  ADD COLUMN created_by INT NULL;
