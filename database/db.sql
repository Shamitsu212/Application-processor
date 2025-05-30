-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: diplomka
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message_id` int NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` int NOT NULL,
  `sender_idusers` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_id` (`message_id`),
  KEY `fk_chat_users1_idx` (`sender_idusers`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `zayavki` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_chat_users1` FOREIGN KEY (`sender_idusers`) REFERENCES `users` (`idusers`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (3,2,'Эта заявка в очереди',1748104812,2),(4,2,'Ну где вы?',1748204812,1),(5,2,'когда подойдете?',1749204812,1),(6,2,'К вам отправлен специалист ожидайте ',1750204812,2);
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comunicate`
--

DROP TABLE IF EXISTS `comunicate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comunicate` (
  `idcomunicate` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`idcomunicate`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comunicate`
--

LOCK TABLES `comunicate` WRITE;
/*!40000 ALTER TABLE `comunicate` DISABLE KEYS */;
INSERT INTO `comunicate` VALUES (1,'admin@example.com','+79991112233'),(2,'moder1@example.com','+79992223344'),(4,'user2@example.com','+79994445566'),(5,'user3@example.com','+79995556677');
/*!40000 ALTER TABLE `comunicate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doki`
--

DROP TABLE IF EXISTS `doki`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doki` (
  `iddoki` int NOT NULL AUTO_INCREMENT,
  `passport` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inn` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `snils` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `oms` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vodila` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`iddoki`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doki`
--

LOCK TABLES `doki` WRITE;
/*!40000 ALTER TABLE `doki` DISABLE KEYS */;
INSERT INTO `doki` VALUES (1,'4510 123456','123456789012','123-456-789 00','1234567890123456','12 34 567890'),(2,'4510 654321','987654321098','987-654-321 00','9876543210987654','98 76 543210'),(4,'4510 222222','222222222222','222-222-222 22','2222222222222222','22 22 222222'),(5,'4510 333333','333333333333','333-333-333 33','3333333333333333','33 33 333333');
/*!40000 ALTER TABLE `doki` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `idrole` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idrole`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Администратор'),(2,'Модератор'),(3,'Пользователь');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `idusers` int NOT NULL AUTO_INCREMENT,
  `login` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `pass` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fam` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `sex` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `role_idrole` int DEFAULT NULL,
  `comunicate_idcomunicate` int DEFAULT NULL,
  `doki_iddoki` int DEFAULT NULL,
  PRIMARY KEY (`idusers`),
  UNIQUE KEY `login` (`login`),
  KEY `role_idrole` (`role_idrole`),
  KEY `comunicate_idcomunicate` (`comunicate_idcomunicate`),
  KEY `doki_iddoki` (`doki_iddoki`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_idrole`) REFERENCES `role` (`idrole`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`comunicate_idcomunicate`) REFERENCES `comunicate` (`idcomunicate`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`doki_iddoki`) REFERENCES `doki` (`iddoki`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'1','1','Вован','Иванов','Иванович','1979-12-31','М',1,1,1,1),(2,'2','2','Петр','Петров','Петрович','1985-05-15','М',1,2,2,2),(4,'user2','userpass2','Мария','Смирнова','Сергеевна','1992-03-10','Ж',1,3,4,4),(5,'user3','userpass3','Сергей','Кузнецов','Дмитриевич','1988-11-25','М',1,3,5,5);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zayavki`
--

DROP TABLE IF EXISTS `zayavki`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zayavki` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shortpage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otschet` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_idusers` int NOT NULL,
  `executor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_zayavki_users1_idx` (`sender_idusers`),
  CONSTRAINT `fk_zayavki_users1` FOREIGN KEY (`sender_idusers`) REFERENCES `users` (`idusers`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zayavki`
--

LOCK TABLES `zayavki` WRITE;
/*!40000 ALTER TABLE `zayavki` DISABLE KEYS */;
INSERT INTO `zayavki` VALUES (2,'Уборка территории','Уборка','Выполнена','Требуется уборка парковой зоны',NULL,'Центральный парк',4,NULL),(16,'Test','Поломка компьютерного оборудования','В процессе выполнения','Test',NULL,'Цех3',1,NULL);
/*!40000 ALTER TABLE `zayavki` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 14:40:06
