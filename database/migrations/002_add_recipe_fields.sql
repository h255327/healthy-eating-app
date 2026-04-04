-- Migration 002: add category, ingredients, instructions, updated_at to recipes

USE healthy_eating_app;

ALTER TABLE recipes
  ADD COLUMN category     VARCHAR(100) DEFAULT NULL AFTER description,
  ADD COLUMN ingredients  TEXT         DEFAULT NULL AFTER category,
  ADD COLUMN instructions TEXT         DEFAULT NULL AFTER ingredients,
  ADD COLUMN updated_at   TIMESTAMP    DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
