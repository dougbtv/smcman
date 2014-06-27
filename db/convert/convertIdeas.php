<?php

	require_once("globals.php");

	$ch = new convertHosting();

	class convertHosting {

		var $db;

		function convertHosting() {

			$this->db = $GLOBALS['db'];

			$ideas = $this->db->getAll("SELECT *,DATE_FORMAT(indate, '%Y-%m-%dT%TZ') AS isodate FROM ideas");

			/*

			

			*/

			foreach ($ideas as $i) {

				/*

					this.ideaSchema = this.mongoose.Schema({
						idea: String,
						nick: String,
						indate: Date
					}, { collection: 'ideas' });

				*/

				$object = array(
					"idea" => $i['idea'],
					"nick" => $i['author'],
					"indate" => array('$date' => (strtotime($i['isodate']) * 1000)),
				);

				$json = json_encode($object);

				echo $json."\n";



			}

		}

	}

?>