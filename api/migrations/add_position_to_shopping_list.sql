-- Add position column to shopping_list table
ALTER TABLE shopping_list ADD COLUMN position INT;

-- Initialize positions based on current IDs
UPDATE shopping_list SET position = id;

-- Create unique index on position to ensure order integrity
ALTER TABLE shopping_list ADD UNIQUE INDEX idx_position (position);