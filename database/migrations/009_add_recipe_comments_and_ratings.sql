-- Migration 009: extend comments table for recipes; add ratings table

USE healthy_eating_app;

-- article_id becomes nullable so a comment can belong to either an article or a recipe
ALTER TABLE comments
  MODIFY COLUMN article_id INT NULL,
  ADD COLUMN recipe_id INT NULL AFTER article_id,
  ADD CONSTRAINT fk_comments_recipe
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

-- One rating per user per recipe; score is 1-5
CREATE TABLE ratings (
  id         INT     NOT NULL AUTO_INCREMENT,
  user_id    INT     NOT NULL,
  recipe_id  INT     NOT NULL,
  score      TINYINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_recipe (user_id, recipe_id),
  CONSTRAINT chk_score CHECK (score >= 1 AND score <= 5),
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
