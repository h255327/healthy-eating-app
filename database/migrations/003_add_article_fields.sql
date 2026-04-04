-- Migration 003: add summary, category, updated_at to articles

USE healthy_eating_app;

ALTER TABLE articles
  ADD COLUMN summary    TEXT         DEFAULT NULL AFTER title,
  ADD COLUMN category   VARCHAR(100) DEFAULT NULL AFTER summary,
  ADD COLUMN updated_at TIMESTAMP    DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER created_at;
