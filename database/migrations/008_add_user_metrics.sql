-- Add biometric and activity fields needed for TDEE/calorie recommendation.
-- All columns are nullable so existing user rows are unaffected.

ALTER TABLE users
  ADD COLUMN height         DECIMAL(5,1) NULL AFTER weight,
  ADD COLUMN age            TINYINT UNSIGNED NULL AFTER height,
  ADD COLUMN sex            ENUM('male','female') NULL AFTER age,
  ADD COLUMN activity_level ENUM('sedentary','lightly_active','moderately_active','very_active','extra_active') NULL AFTER sex;
