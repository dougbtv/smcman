-- MySQL dump 10.13  Distrib 5.1.69, for redhat-linux-gnu (i386)
--
-- Host: localhost    Database: smcbot
-- ------------------------------------------------------
-- Server version	5.1.69

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ideas`
--

DROP TABLE IF EXISTS `ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ideas` (
  `recnum` int(11) NOT NULL AUTO_INCREMENT,
  `idea` text,
  `author` varchar(255) DEFAULT NULL,
  `indate` datetime DEFAULT NULL,
  PRIMARY KEY (`recnum`)
) ENGINE=MyISAM AUTO_INCREMENT=152 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES (1,'Sad Snowman','artao','2014-01-06 04:44:56'),(2,'Angry Snowman','artao','2014-01-06 04:45:04'),(3,'Communications Satellite','artao','2014-01-06 04:45:16'),(4,'Alarm Clock','artao','2014-01-06 04:45:32'),(5,'Alien Skull','artao','2014-01-06 04:45:53'),(6,'Ebola Virus','artao','2014-01-06 04:46:03'),(7,'Window Bllnds','artao','2014-01-06 04:46:26'),(8,'Cargo Spacecraft','artao','2014-01-06 04:46:35'),(9,'Smuggler Spacecraft','artao','2014-01-06 04:46:44'),(10,'Interstellar Science Facility','artao','2014-01-06 04:47:02'),(11,'Milk Crate','artao','2014-01-06 04:47:24'),(12,'Game Controller','artao','2014-01-06 04:47:46'),(13,'Female Stimulation Device','GreenJello','2014-01-06 04:49:41'),(14,'Rotary Telephone','artao','2014-01-06 04:49:43'),(15,'Simple (non-smart) Telephone','artao','2014-01-06 04:49:59'),(16,'Pocket Knife','artao','2014-01-06 04:50:19'),(17,'Bowie Knife','artao','2014-01-06 04:50:29'),(18,'Kitteh Cat','artao','2014-01-06 04:50:53'),(19,'Abacus','artao','2014-01-06 04:51:14'),(20,'Nunchucks','artao','2014-01-06 04:51:37'),(21,'Sai','artao','2014-01-06 04:51:44'),(22,'Bastard Sword','artao','2014-01-06 04:51:55'),(23,'Evil Grimoire','artao','2014-01-06 04:52:11'),(24,'Shuriken','artao','2014-01-06 04:52:23'),(25,'Blender Logo','artao','2014-01-06 04:57:11'),(26,'Electric Stove','artao','2014-01-06 05:02:34'),(27,'Gas Stove','artao','2014-01-06 05:02:39'),(28,'Camping Stove','artao','2014-01-06 05:02:47'),(29,'Turban','artao','2014-01-06 05:03:00'),(30,'Ornate Candlestick','artao','2014-01-06 05:03:13'),(31,'Military Surveillance Satellite','artao','2014-01-06 05:03:41'),(32,'Binoculars','artao','2014-01-06 06:25:20'),(33,'Toothbrush','artao','2014-01-06 06:25:25'),(34,'Microphone','artao','2014-01-06 06:25:38'),(35,'Pagoda','artao','2014-01-06 06:26:03'),(36,'Hazmat Suit','artao','2014-01-06 06:27:50'),(37,'Luxury Passenger Space Cruiser','artao','2014-01-06 06:36:24'),(38,'Guitar','artao','2014-01-06 06:41:55'),(39,'Flute','artao','2014-01-06 06:42:04'),(40,'French Horn','artao','2014-01-06 06:42:11'),(41,'Snare Drum','artao','2014-01-06 06:42:19'),(42,'Thermo-Nuclear train','SoulerWork','2014-01-06 06:42:37'),(43,'Pick Axe','artao','2014-01-06 06:42:55'),(44,'Rowboat','artao','2014-01-06 06:43:18'),(45,'Sail Boat','artao','2014-01-06 06:43:24'),(46,'Bi-Plane','artao','2014-01-06 06:43:38'),(47,'Bicycle','artao','2014-01-06 06:43:48'),(70,'Classic Sci-Fi Robot','artao','2014-01-12 17:32:07'),(49,'phallic rendition of the mona lisa preferably where he nose constitutes the penis','swordsmanz','2014-01-06 06:53:46'),(50,'breastmilk with breast','swordsmanz','2014-01-06 06:54:30'),(69,'alltheoldideasinone','SurgeMedic','2014-01-12 15:53:38'),(52,'exploding aerosol can','swordsmanz','2014-01-06 06:56:07'),(53,'Crab','artao','2014-01-06 06:57:29'),(54,'Lobster','artao','2014-01-06 06:57:34'),(55,'Catfish','artao','2014-01-06 06:57:49'),(56,'Joystick','artao','2014-01-06 06:58:00'),(57,'Wireless Router','artao','2014-01-06 06:58:22'),(58,'Tardis','artao','2014-01-06 06:58:35'),(59,'Sonic Screwdriver','artao','2014-01-06 06:58:47'),(60,'Egyptian God Set','artao','2014-01-06 06:59:11'),(61,'Egyptian God Annubis','artao','2014-01-06 06:59:21'),(62,'Tower Crane','artao','2014-01-06 07:01:03'),(63,'Bulldozer','artao','2014-01-06 07:01:10'),(64,'Skateboard','artao','2014-01-06 07:12:46'),(65,'Octopus','artao','2014-01-06 07:17:12'),(66,'Snail','artao','2014-01-06 07:17:15'),(67,'Turtle','artao','2014-01-06 07:17:24'),(68,'SMCMAN','artao','2014-01-07 03:29:27'),(71,'snapple bottle','Jeepster[]','2014-01-12 17:37:40'),(72,'Barn Owl','artao','2014-01-12 18:29:53'),(73,'horny goat fucker','swordsmanz','2014-01-13 11:57:35'),(74,'Diving Bell','artao','2014-01-13 13:27:49'),(75,'cowsex(NSFW)','swordsmanz','2014-01-13 13:29:17'),(76,'Bacon Double Cheeseburger','artao','2014-01-13 13:49:49'),(77,'Hollowed Out Tree Stump (aka Log)','artao','2014-01-14 18:55:04'),(78,'Punk Rock Orc','Poerts','2014-01-14 18:58:44'),(79,'wide-eyed fish','Teh_Bucket','2014-01-19 00:01:22'),(80,'Ouroborous','artao','2014-01-20 19:18:33'),(81,'alligator','Teh_Bucket','2014-01-23 20:04:20'),(82,'Pirate Ship','artao','2014-01-24 07:39:50'),(83,'tiamat','Teh_Bucket','2014-01-24 14:59:25'),(84,'comic strip page sdc','Teh_Bucket','2014-01-30 13:54:46'),(85,'Mr. Hanky the Christmas Poo','artao','2014-02-03 19:16:18'),(86,'meowthership','Teh_Bucket','2014-02-05 14:59:01'),(87,'lactating cat tit','swordsmanz','2014-02-05 14:59:38'),(88,'Pedobear','artao','2014-02-10 20:09:59'),(89,'Ship of Imagination','ddwagnz','2014-03-03 01:49:08'),(90,'Smiling Mutant Cat','artao','2014-03-07 16:40:45'),(91,'Spaghetti Meatballs Cake','artao','2014-03-07 16:41:33'),(92,'Sad Muthafuckin Clown','artao','2014-03-07 16:41:45'),(93,'Space Mouse Car','artao','2014-03-07 16:42:15'),(94,'Fartnado','artao','2014-03-10 16:40:05'),(95,'Trilobite','artao','2014-03-18 13:50:05'),(96,'Earworm','artao','2014-03-18 22:26:43'),(97,'Spanktopus','artao','2014-03-21 18:48:33'),(98,'Botulimpotamus','artao','2014-03-21 23:26:03'),(99,'Superchupacabraman','artao','2014-03-23 20:26:34'),(100,'Frags (the things that get defragged off your disk)','artao','2014-03-24 02:47:25'),(101,'MIDI Grid Sequencer','artao','2014-03-26 21:31:38'),(102,'Atomic Stomp Filter','artao','2014-03-26 23:07:05'),(103,'Mechanical Hamburger','artao','2014-03-29 22:24:36'),(104,'Woven Basket','artao','2014-03-29 22:25:05'),(105,'Perfect Booty','artao5','2014-03-30 21:38:57'),(106,'Pudenda (NSFW)','artao5','2014-03-30 21:39:36'),(107,'latin pro','Anitox','2014-04-03 22:18:36'),(108,'Hendrix\'s Guitar','artao','2014-04-03 22:22:02'),(109,'The Monster Under The Bed','artao','2014-04-03 22:22:55'),(110,'Cubist Sphere','artao','2014-04-05 02:44:00'),(111,'new desktop for bucket','Teh_Bucket','2014-04-05 03:22:24'),(112,'The Beast With 1000 Backs','artao','2014-04-05 06:49:23'),(113,'Fat','fly1','2014-04-05 17:22:44'),(114,'Sextant','artao','2014-04-07 08:59:44'),(115,'Theodolite','artao','2014-04-07 08:59:49'),(116,'Minaret','artao','2014-04-07 10:32:23'),(118,'Pirate Ship','artao','2014-04-18 19:41:07'),(119,'Battleship (space or water)','artao','2014-04-18 19:42:24'),(120,'Cat Toy','artao','2014-04-18 19:49:21'),(121,'whipping rack','swordsmanz','2014-04-19 11:53:39'),(122,'Indescribable Abomination','artao','2014-04-28 11:32:15'),(123,'Ancient Lich','artao','2014-04-28 11:33:07'),(124,'The Thing That Shouldn\'t Be','artao','2014-04-28 11:34:57'),(125,'Sacrificial Kris Knife','artao','2014-04-28 11:42:19'),(126,'Gas Giant Planet Mining Spaceship','artao','2014-04-28 15:33:54'),(127,'Hexadecimal Underpants','artao','2014-04-28 16:22:52'),(128,'Clustermunition Ham','artao','2014-04-28 16:30:27'),(129,'verve painting','Teh_Bucket','2014-04-28 22:37:02'),(130,'Tsthoggua','artao','2014-04-29 07:46:19'),(131,'Zvilpogghua','artao','2014-04-29 07:47:56'),(132,'Tampon Cannon','artao','2014-04-29 08:57:31'),(133,'mech wombat','Teh_Bucket','2014-05-09 02:03:49'),(134,'mech sandvich','Jeepster[]','2014-05-09 02:14:44'),(135,'ham wombat','Teh_Bucket','2014-05-09 02:15:00'),(137,'Spaceman Spiff\'s Spaceship','artao','2014-05-21 05:08:10'),(138,'Calvin and Hobbes','artao','2014-05-26 12:41:19'),(139,'Anemometer','artao','2014-06-10 01:56:29'),(140,'Suface of a Blasted Asteroid','artao','2014-06-13 19:17:23'),(141,'Left handed screwdriver','','2014-06-17 17:01:11'),(142,'Fazzyllascope','artao','2014-06-19 00:05:04'),(143,'Lonely Old Men','home','2014-06-19 00:15:39'),(144,'sexy man panties','Teh_Bucket','2014-06-19 20:17:53'),(145,'sexy lady panties','sherlock','2014-06-19 20:18:31'),(146,'sexy gender neutral panties','sherlock','2014-06-19 20:18:46'),(147,'sexy genderqueer panties','sherlock','2014-06-19 20:59:11'),(148,'Rucksack','artao','2014-06-23 08:28:00'),(149,'Nut Sack (for storing nuts, pervert!!!)','artao','2014-06-23 08:29:10'),(150,'Dead Kittens','home','2014-06-25 00:05:17'),(151,'Mummified Kittens','home','2014-06-25 00:05:30');
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-06-27 13:31:56
