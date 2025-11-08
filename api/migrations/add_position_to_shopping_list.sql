-- Add position column to shopping_list table
ALTER TABLE shopping_list ADD COLUMN position INT;

-- Initialize positions based on current IDs
UPDATE shopping_list SET position = id;
