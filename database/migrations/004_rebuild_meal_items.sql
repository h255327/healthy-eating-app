-- Migration 004: rebuild meal_items for manual calorie tracking,
--                add created_at to meals

USE healthy_eating_app;

ALTER TABLE meals
  ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

DROP TABLE IF EXISTS meal_items;

CREATE TABLE meal_items (
  id       INT            NOT NULL AUTO_INCREMENT,
  meal_id  INT            NOT NULL,
  name     VARCHAR(150)   NOT NULL,
  quantity DECIMAL(8, 2)  NOT NULL DEFAULT 1,
  unit     VARCHAR(30)    NOT NULL DEFAULT 'g',
  calories DECIMAL(8, 2)  NOT NULL DEFAULT 0,
  protein  DECIMAL(8, 2)  NOT NULL DEFAULT 0,
  carbs    DECIMAL(8, 2)  NOT NULL DEFAULT 0,
  fat      DECIMAL(8, 2)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
);
