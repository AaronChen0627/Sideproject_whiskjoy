-- MySQL dump 10.13  Distrib 9.0.1, for macos14.4 (arm64)
--
-- Host: 127.0.0.1    Database: whiskyjoy
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Brands`
--

DROP TABLE IF EXISTS `Brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brands` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `brand_name_zh` varchar(255) NOT NULL,
  `brand_name_en` varchar(255) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brand_name_zh` (`brand_name_zh`,`brand_name_en`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brands`
--

LOCK TABLES `Brands` WRITE;
/*!40000 ALTER TABLE `Brands` DISABLE KEYS */;
INSERT INTO `Brands` VALUES ('55232b72-b6ce-11ef-bdd3-aa7341ecdd8c','大摩a','BiagM','https://www.example.com/bigM'),('62fde178-b61b-11ef-bdd3-aa7341ecdd8c','大摩','BigM','https://www.example.com/bigM'),('74161340-b85a-11ef-832b-abbeb65587a6','大','Bc','https://www.example.com/bigM'),('c6f67616-b609-11ef-bdd3-aa7341ecdd8c','麥卡倫','Macallan','https://www.example.com/macallan'),('c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','高原騎士','Highland Park','https://www.example.com/highland-park'),('ea67ae40-b95f-11ef-832b-abbeb65587a6','里仁','li','https://www.example.com/bigM');
/*!40000 ALTER TABLE `Brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `category_name_zh` varchar(255) NOT NULL,
  `category_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES ('ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','單一麥芽','Single Malt'),('ce7498ee-b606-11ef-bdd3-aa7341ecdd8c','原桶強度','Cask Strength'),('ce749b82-b606-11ef-bdd3-aa7341ecdd8c','單桶','Single Cask'),('ce749c68-b606-11ef-bdd3-aa7341ecdd8c','調和威士忌','Blended'),('ce749d3a-b606-11ef-bdd3-aa7341ecdd8c','調和式','Blended'),('ce749e02-b606-11ef-bdd3-aa7341ecdd8c','穀物','Grain'),('ce74a0e6-b606-11ef-bdd3-aa7341ecdd8c','波本','Bourbon');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `product_id` char(36) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('2e610f16-c3a0-11ef-832b-abbeb65587a6','e4d34958-c12a-11ef-832b-abbeb65587a6','2d97e2ce-b60a-11ef-bdd3-aa7341ecdd8c','真的','2024-12-26 15:43:41','2024-12-26 15:43:41'),('4463739e-c48b-11ef-832b-abbeb65587a6','e4d34958-c12a-11ef-832b-abbeb65587a6','8dace470-b60a-11ef-bdd3-aa7341ecdd8c','a','2024-12-27 19:46:29','2024-12-27 19:46:29'),('8aac8f00-c366-11ef-832b-abbeb65587a6','d146b018-c365-11ef-832b-abbeb65587a6','2d97e2ce-b60a-11ef-bdd3-aa7341ecdd8c','這個很棒','2024-12-26 08:51:05','2024-12-26 08:51:20'),('95618aec-c391-11ef-832b-abbeb65587a6','e4d34958-c12a-11ef-832b-abbeb65587a6','34e61898-b619-11ef-bdd3-aa7341ecdd8c','我有點亂寫一通\n','2024-12-26 13:59:11','2024-12-26 13:59:19'),('a871c944-c391-11ef-832b-abbeb65587a6','bce73bda-c38b-11ef-832b-abbeb65587a6','34e61898-b619-11ef-bdd3-aa7341ecdd8c','真的嗎','2024-12-26 13:59:43','2024-12-26 13:59:43'),('d94e8f5c-c3a0-11ef-832b-abbeb65587a6','d842b54a-babb-11ef-832b-abbeb65587a6','34e61898-b619-11ef-bdd3-aa7341ecdd8c','一、為什麼你的長文沒有人看？\n我把臉書長文定義為700字以上，內容以文字為主體的貼文，這個字數以上的貼文，讀者需要真的額外花時間去閱讀。\n\n之所以上面會說「讀者不喜歡長文是個謬誤」是因為：「讀者不是不讀長文，是不讀無聊的文章。」\n\n什麼是無聊的文章？\n\n無聊因人而異，這裡我把無聊定義為：「讀者在文章中找不到意義感。」就像上班時你同事跟你分享他上週末去看的展，可是你真的完全不感興趣，腦袋開始放空。可是為了繼續當好同事，我們還是要假裝很有興趣的「嗯嗯嗯，真的嗎？」一下。那如果是臉書貼文的話，你早就滑掉囉！\n\n在文章中「無聊」更具體的情況是：\n\n太多跟主題無關的資訊｜你可以直接講重點嗎？這種感覺\n資訊不符合你的讀者 ｜例如在爵士音樂論壇聊怎麼改檔車\n格式不符合臉書｜例如在臉書PO自己的大學畢論\n結論：讀者在文章中沒看到他預期的內容。\n\n基本上讀者點到一篇文章，一定都會有讀者最好奇的點。像現在這篇文章的重點是「如何寫好臉書長文」。那如果你看了半天，我都在講寫文章的心路歷程跟遇到的挫折，你馬上就會失去興趣。\n\n因為文章沒有回應到你點進來的期待。\n\n對我而言，我覺得讓讀者覺得文章讀起來有意義感，一個很好的方法就是對話，那要怎麼寫出有對話感的文章，我第三段會詳細說(你也可以直接跳到第三段)。\n\n畢竟我們的平台是社群平台，不是Wikipedia，所以資訊不用像百科全書這麼精準，只要你能引起讀者的興趣(Engage)，讓他跟你一起經歷故事，有時候寫出一些瑣碎的細節或心情的轉折，反而會讓人更身歷其境。\n\n那有人的文章是不在主題上，都亂寫還很紅的嗎？\n\n其實有，例如網路長文王者—二師兄，他文章就沒什麼重點，一直超展開，可是因為內容很鏹很好笑，讀者就會一直想讀下去。(雖然邏輯上來說，讀者看他的文章的意義感來源本來就是搞笑。)\n\n【小結】\n就像我們會看一整天美劇，也會看五分鐘的狂新聞，只要你讓讀者有興趣，就算是很長的文章，讀者也會願意閱讀。重點是你花很多字數著墨的地方是不是讀者有興趣的點，是不是他點進這篇文章想看到的東西。\n\n二、我的臉書長文的格式，具體馬上可以使用的。\n我師傅跟我說：「一篇好的文章就是一個吸引人的標題配上一個好的結論。」那要怎麼想到好的標題跟結論呢？這是我的方法，如果覺得還不錯，歡迎直接拿去用。\n\n『最令人頭痛的標題』\n\n基本上我只下兩種標題，1.大家都好奇的問句 2.反直覺的描述句。現在這篇文章屬於第1種。我之前寫的「你搞錯了，你想要的不是贏。」、「去選擇不自由」屬於第2種。\n\n問題本身很吸引人的話就直接端出來。我之前寫的「我到底該不該讀大學(休學)？」、「如何挖掘自己的興趣與自我實現？」都有破萬的點閱率。這種大家都很好奇的題目，不只吸引讀者，也很受Google搜尋引擎的青睞。像「該不該讀大學」現在是該關鍵字Google的前三名(寫的時候完全沒預期到)。\n\n','2024-12-26 15:48:27','2024-12-26 15:49:18'),('e1116d02-c393-11ef-832b-abbeb65587a6','d146b018-c365-11ef-832b-abbeb65587a6','34e61898-b619-11ef-bdd3-aa7341ecdd8c','好累','2024-12-26 14:15:37','2024-12-26 14:15:37');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Countries`
--

DROP TABLE IF EXISTS `Countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Countries` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `country_name_zh` varchar(255) NOT NULL,
  `country_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Countries`
--

LOCK TABLES `Countries` WRITE;
/*!40000 ALTER TABLE `Countries` DISABLE KEYS */;
INSERT INTO `Countries` VALUES ('a0e7f59c-b606-11ef-bdd3-aa7341ecdd8c','愛爾蘭','Ireland'),('a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','蘇格蘭','Scotland'),('a0e81f9a-b606-11ef-bdd3-aa7341ecdd8c','日本','Japan'),('a0e82120-b606-11ef-bdd3-aa7341ecdd8c','加拿大','Canada'),('a0e82292-b606-11ef-bdd3-aa7341ecdd8c','美國','America'),('a0e823a0-b606-11ef-bdd3-aa7341ecdd8c','臺灣','Taiwan'),('a0e82486-b606-11ef-bdd3-aa7341ecdd8c','其他','Other');
/*!40000 ALTER TABLE `Countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `google_users`
--

DROP TABLE IF EXISTS `google_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `google_users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `google_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `google_users_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `google_users`
--

LOCK TABLES `google_users` WRITE;
/*!40000 ALTER TABLE `google_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `google_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `country_id` char(36) NOT NULL,
  `region_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `category_id` char(36) NOT NULL,
  `brand_id` char(36) NOT NULL,
  `product_name_zh` varchar(255) NOT NULL,
  `product_name_en` varchar(255) NOT NULL,
  `product_image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_name_zh` (`product_name_zh`,`product_name_en`),
  KEY `country_id` (`country_id`),
  KEY `region_id` (`region_id`),
  KEY `category_id` (`category_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `Countries` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`region_id`) REFERENCES `Regions` (`id`),
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`),
  CONSTRAINT `products_ibfk_4` FOREIGN KEY (`brand_id`) REFERENCES `Brands` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES ('2d97e2ce-b60a-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f40e34-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f67616-b609-11ef-bdd3-aa7341ecdd8c','CLASSIC CUT 2024','Classic Cut 2024','https://cw-image-resizer.cwg.tw/resize/uri/https%3A%2F%2Fcdn-www.cw.com.tw%2Farticle%2F201810%2Farticle-5bd182cf13ebb.jpg/?w=1600&format=webp'),('34e61898-b619-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','5 20d19限量版','55 August 20d19 Release','https://www.my9.com.tw/cdn/shop/products/M15211d-1_2000x.png?v=1580480847'),('3d93998a-b627-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','55 20d19限量','525 Augufdst 20d19sd Release','https://www.my9.com.tw/cdn/shop/products/M1521dsf1d-1_22000x.png?v=1580480847'),('7d0e8a42-b614-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','2年 2019限量版','2Y August 2019 Release','https://www.my9.com.tw/cdn/shop/products/M15211-1_2000x.png?v=1580480847'),('83e60a92-b62e-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','62fde178-b61b-11ef-bdd3-aa7341ecdd8c','更新產品','Updated Product','https://example.com/updated_product.jpg'),('8dace470-b60a-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','21年 2019限量版','21Y August 2019 Release','https://www.my9.com.tw/cdn/shop/products/M15211-1_2000x.png?v=1580480847'),('8f55e71c-b6d3-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c',NULL,'ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','穆赫','mo','https://example.com/updated_product.jpg'),('9d7dcc30-b618-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','ce7488a4-b606-11ef-bdd3-aa7341ecdd8c','c6f6ce9a-b609-11ef-bdd3-aa7341ecdd8c','55 2019限量版','55 August 2019 Release','https://www.my9.com.tw/cdn/shop/products/M15211-1_2000x.png?v=1580480847');
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Regions`
--

DROP TABLE IF EXISTS `Regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Regions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `country_id` char(36) NOT NULL,
  `region_name_zh` varchar(255) NOT NULL,
  `region_name_en` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `regions_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `Countries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Regions`
--

LOCK TABLES `Regions` WRITE;
/*!40000 ALTER TABLE `Regions` DISABLE KEYS */;
INSERT INTO `Regions` VALUES ('f2f3ffc0-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','低地區','Lowland'),('f2f40baa-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','高地區','Highland'),('f2f40e34-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','斯貝賽區','Speyside'),('f2f40fba-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','艾雷島區','Islay'),('f2f4114a-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','島嶼區','Island'),('f2f412da-b606-11ef-bdd3-aa7341ecdd8c','a0e81c34-b606-11ef-bdd3-aa7341ecdd8c','坎貝爾鎮','Campbeltown');
/*!40000 ALTER TABLE `Regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `user_id` char(36) NOT NULL,
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES ('639b92e0-c12b-11ef-832b-abbeb65587a6','d842b54a-babb-11ef-832b-abbeb65587a6','admin','https://media.istockphoto.com/id/1503385646/zh/%E7%85%A7%E7%89%87/portrait-funny-and-happy-shiba-inu-puppy-dog-peeking-out-from-behind-a-blue-banner-isolated-on.jpg?s=2048x2048&w=is&k=20&c=7guGNeaISsHNrC5JXrZfhIkQTLJMXdzZMsy_XBtgvXs=','2024-12-23 12:42:37','2024-12-23 12:42:37'),('7b9af538-c37f-11ef-832b-abbeb65587a6','d146b018-c365-11ef-832b-abbeb65587a6','a','https://s.yimg.com/ny/api/res/1.2/8mj_DmBctBS1Akvl4R_1dg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTY0MDtjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2022-06/3757bb00-eca8-11ec-bf3f-7c2b69f1b53a','2024-12-26 11:49:37','2024-12-26 11:49:37'),('b06eab80-c2a1-11ef-832b-abbeb65587a6','e4d34958-c12a-11ef-832b-abbeb65587a6','ab86627','https://memeprod.sgp1.digitaloceanspaces.com/user-wtf/1633459396752.jpg','2024-12-25 09:21:57','2024-12-25 09:21:57'),('f6188a32-c398-11ef-832b-abbeb65587a6','bce73bda-c38b-11ef-832b-abbeb65587a6','b','https://media.istockphoto.com/id/1413100088/zh/%E5%90%91%E9%87%8F/koala-sitting-winking-cute-creative-kawaii-cartoon-mascot-logo.jpg?s=2048x2048&w=is&k=20&c=1fs67kN3-dR5n-5F70s7acZWkkku4l33LmQPDPwSYjg=','2024-12-26 14:52:00','2024-12-26 14:52:00');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('bce73bda-c38b-11ef-832b-abbeb65587a6','b@gmail.com','$2a$10$7JZbMvrU4aQ1FwXxaRWPi.MglCYJlfpfyC4vCTd2tKwOaIxWootDm','user','2024-12-26 13:17:20','2024-12-26 13:17:20'),('d146b018-c365-11ef-832b-abbeb65587a6','a@gmail.com','$2b$10$AI6B/qnm26jz5.WlQRIx4eORbYfRLw./RD/7ngpZDE4D5zRdLHXuq','user','2024-12-26 08:45:54','2024-12-26 08:45:54'),('d842b54a-babb-11ef-832b-abbeb65587a6','aaronchen0627@gmail.com','$2b$10$5Ube155l7JwY4kboFEY9CuErNFtfRpxpQAFbM5hmIc2b3CMz5QKdW','admin','2024-12-15 08:09:02','2024-12-23 12:32:09'),('e4d34958-c12a-11ef-832b-abbeb65587a6','ab86627@gmail.com','$2b$10$IP2kh99n8JjgnqoxWpFFXOj7SuQVlAB58aQbiC9JwgWlEEFUPL11m','user','2024-12-23 12:39:04','2024-12-23 12:39:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'whiskyjoy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-28 16:49:47
