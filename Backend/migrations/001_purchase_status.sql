-- Run this once against your IMS database (MySQL).
-- Skip any line that errors with "Duplicate column name".

ALTER TABLE purchase ADD COLUMN purchase_date DATE NULL;
-- New installs: include rejected in one step
-- ALTER TABLE purchase ADD COLUMN status ENUM('draft', 'completed', 'rejected') NOT NULL DEFAULT 'draft';

-- If status already exists as ENUM('draft','completed') only, run instead:
--   Backend/migrations/002_add_rejected_status.sql
ALTER TABLE purchase ADD COLUMN total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0;

-- Optional: track who created the purchase
-- ALTER TABLE purchase ADD COLUMN created_by INT NULL;

-- Line items table (run only if you do not already have purchase_items / purchase_item).
-- If your table uses `price` instead of `unit_price`, the app detects columns automatically.
CREATE TABLE IF NOT EXISTS purchase_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES purchase(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);
