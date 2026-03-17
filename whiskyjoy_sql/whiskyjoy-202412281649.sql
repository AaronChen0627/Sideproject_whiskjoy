-- 1. 徹底清空並建立資料庫
DROP DATABASE IF EXISTS whiskyjoy;
CREATE DATABASE whiskyjoy CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE whiskyjoy;

-- 2. 帳號與權限模組
CREATE TABLE `users` (
  `id` char(36) NOT NULL, -- 移除 DEFAULT，由程式端產生
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB;

CREATE TABLE `user_profiles` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `account` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`),
  UNIQUE KEY `unique_user_id` (`user_id`),
  CONSTRAINT `fk_profile_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `google_users` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `google_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  CONSTRAINT `fk_google_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. 威士忌維度模組
CREATE TABLE `brands` (
  `id` char(36) NOT NULL,
  `brand_name_zh` varchar(255) NOT NULL,
  `brand_name_en` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_brand` (`brand_name_zh`, `brand_name_en`)
) ENGINE=InnoDB;

CREATE TABLE `categories` (
  `id` char(36) NOT NULL,
  `category_name_zh` varchar(255) NOT NULL,
  `category_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `countries` (
  `id` char(36) NOT NULL,
  `country_name_zh` varchar(255) NOT NULL,
  `country_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `regions` (
  `id` char(36) NOT NULL,
  `country_id` char(36) NOT NULL,
  `region_name_zh` varchar(255) NOT NULL,
  `region_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_region_country_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. 產品與評論模組
CREATE TABLE `products` (
  `id` char(36) NOT NULL,
  `country_id` char(36) NOT NULL,
  `region_id` char(36) DEFAULT NULL,
  `category_id` char(36) NOT NULL,
  `brand_id` char(36) NOT NULL,
  `product_name_zh` varchar(255) NOT NULL,
  `product_name_en` varchar(255) NOT NULL,
  `product_image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_product_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  CONSTRAINT `fk_product_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_product_country_id` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB;

CREATE TABLE `comments` (
  `id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`, `product_id`),
  CONSTRAINT `fk_comment_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. 初始化 Admin 帳號
-- 這裡維持手動指定的 UUID，程式端不會有影響
SET @admin_uuid = '77eb3586-21bb-11f1-90eb-da7533449665';
INSERT INTO `users` (`id`, `email`, `password_hash`, `role`) VALUES 
(@admin_uuid, 'admin@gmail.com', '$2a$10$XDMyjg9U8xbu1iCi3hbE5eHSklPchJJq3zV7iUjnhezF5gP84IqRy', 'admin');

INSERT INTO `user_profiles` (`id`, `user_id`, `account`) VALUES 
(uuid(), @admin_uuid, 'admin'); -- 初始化腳本可以用 uuid() 快速產生一個