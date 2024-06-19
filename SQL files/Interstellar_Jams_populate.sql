-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: interstellar_jams
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `boardmatch`
--

LOCK TABLES `boardmatch` WRITE;
/*!40000 ALTER TABLE `boardmatch` DISABLE KEYS */;
INSERT INTO `boardmatch` VALUES (1,1,1,0),(1,2,1,0),(1,3,1,0),(1,4,1,0),(1,5,1,0),(1,6,1,0),(1,7,1,0),(1,8,1,0),(1,9,1,0),(1,10,1,0),(1,11,1,0),(1,12,1,0),(1,13,1,0),(1,14,1,0),(1,15,1,0),(1,16,1,0),(1,17,1,0),(1,18,1,0),(1,19,1,0),(1,20,1,0),(1,21,1,0),(1,22,1,0),(1,23,1,0),(1,24,1,0),(1,25,1,0),(1,26,1,0),(1,27,1,0),(1,28,1,0),(1,29,1,0),(1,30,1,0),(1,31,1,0),(1,32,1,0),(1,33,1,0),(1,34,1,0),(1,35,1,0),(1,36,1,0),(1,37,1,0),(1,38,1,0),(1,39,1,0),(1,40,1,0),(1,41,1,0),(1,42,1,0),(1,43,1,0),(1,44,1,0),(1,45,1,0),(1,46,1,0),(1,47,1,0),(1,48,1,0),(1,49,1,0),(1,50,1,0),(1,51,1,0),(1,52,1,0),(1,53,1,0),(1,54,1,0),(1,55,1,0),(1,56,1,0),(1,57,1,0),(1,58,1,0),(1,59,1,0),(1,60,1,0),(1,61,1,0),(1,62,1,0),(1,63,1,0),(1,64,1,0),(1,65,1,0),(1,66,1,0),(1,67,1,0),(1,68,1,0),(1,69,1,0),(1,70,1,0),(1,71,1,0),(1,72,1,0),(1,73,1,0),(1,74,1,0),(1,75,1,0),(1,76,1,0),(1,77,1,0),(1,78,1,0),(1,79,1,0),(1,80,1,0),(1,81,1,0),(1,82,1,0),(1,83,1,0),(1,84,1,0),(1,85,1,0),(1,86,1,0),(1,87,1,0),(1,88,1,0),(1,89,1,0),(1,90,1,0),(1,91,1,0),(1,92,1,0),(1,93,1,0),(1,94,1,0),(1,95,1,0),(1,96,1,0),(1,97,1,0),(1,98,1,0),(1,99,1,0),(1,100,1,0),(1,101,1,0),(1,102,1,0),(1,103,1,0),(1,104,1,0),(1,105,1,0),(1,106,1,0),(1,107,1,0),(1,108,1,0),(1,109,1,0),(1,110,1,0),(1,111,1,0),(1,112,1,0),(1,113,1,0),(1,114,1,0),(1,115,1,0),(1,116,1,0),(1,117,1,0),(1,118,1,0),(1,119,1,0),(1,120,1,0),(1,121,1,0),(1,122,1,0),(1,123,1,0),(1,124,1,0),(1,125,1,0),(1,126,1,0);
/*!40000 ALTER TABLE `boardmatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cassette`
--

LOCK TABLES `cassette` WRITE;
/*!40000 ALTER TABLE `cassette` DISABLE KEYS */;
INSERT INTO `cassette` VALUES (1,'Meteor',1,3),(2,'BlackHole',1,3),(4,'StopSign',3,1),(5,'CassetteBreak',3,1),(6,'RemoteControl',2,1);
/*!40000 ALTER TABLE `cassette` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `cassettetype`
--

LOCK TABLES `cassettetype` WRITE;
/*!40000 ALTER TABLE `cassettetype` DISABLE KEYS */;
INSERT INTO `cassettetype` VALUES (1,'placables'),(2,'controlables'),(3,'blockables');
/*!40000 ALTER TABLE `cassettetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `gamematch`
--

LOCK TABLES `gamematch` WRITE;
/*!40000 ALTER TABLE `gamematch` DISABLE KEYS */;
INSERT INTO `gamematch` VALUES (1,112,1,1,'');
/*!40000 ALTER TABLE `gamematch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `hazard`
--

LOCK TABLES `hazard` WRITE;
/*!40000 ALTER TABLE `hazard` DISABLE KEYS */;
INSERT INTO `hazard` VALUES (1,'Meteor',3,1),(2,'BlackHole',3,2),(3,'WormHole',6,3);
/*!40000 ALTER TABLE `hazard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `map`
--

LOCK TABLES `map` WRITE;
/*!40000 ALTER TABLE `map` DISABLE KEYS */;
INSERT INTO `map` VALUES (1,'between the stars');
/*!40000 ALTER TABLE `map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `matchstate`
--

LOCK TABLES `matchstate` WRITE;
/*!40000 ALTER TABLE `matchstate` DISABLE KEYS */;
INSERT INTO `matchstate` VALUES (1,'Player1 turn'),(2,'Player2 turn'),(3,'match ended');
/*!40000 ALTER TABLE `matchstate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `player`
--

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;
INSERT INTO `player` VALUES (1,'destroyer2009',1,2,'12345'),(2,'boss228',0,0,'12345'),(3,'test',0,0,'12345'),(4,'veytt',0,0,'12345'),(5,'12345',0,0,'12345'),(6,'osteopat2222',0,0,'12345');
/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `playermatch`
--

LOCK TABLES `playermatch` WRITE;
/*!40000 ALTER TABLE `playermatch` DISABLE KEYS */;
INSERT INTO `playermatch` VALUES (1,1,62,1,0,0,0,0,0,0,'0','0'),(2,1,76,1,0,0,0,0,0,0,'0','0');
/*!40000 ALTER TABLE `playermatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `playermatchcassette`
--

LOCK TABLES `playermatchcassette` WRITE;
/*!40000 ALTER TABLE `playermatchcassette` DISABLE KEYS */;
INSERT INTO `playermatchcassette` VALUES (1,1,1),(1,2,1),(2,1,0),(2,2,1);
/*!40000 ALTER TABLE `playermatchcassette` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tiletype`
--

LOCK TABLES `tiletype` WRITE;
/*!40000 ALTER TABLE `tiletype` DISABLE KEYS */;
INSERT INTO `tiletype` VALUES (1,'empty'),(2,'meteor'),(3,'blackhole'),(4,'wormhole');
/*!40000 ALTER TABLE `tiletype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-10 23:48:51
