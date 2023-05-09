const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "cricketMatchDetails.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
//1
const constan = (each) => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
  };
};
app.get("/players/", async (request, response) => {
  const s = `SELECT * FROM player_details;`;
  const a = await database.all(s);
  response.send(a.map((each) => constan(each)));
});
//2
const constem = (aw) => {
  return {
    playerId: aw.player_id,
    playerName: aw.player_name,
  };
};
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const se = `SELECT * FROM player_details WHERE player_id=${playerId};`;
  const aw = await database.get(se);
  response.send(constem(aw));
});
//3

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const techuko = request.body;
  const { playerName } = techuko;
  const sel = `UPDATE player_details SET player_name='${playerName}' WHERE player_id=${playerId};`;
  const awa = await database.run(sel);
  response.send("Player Details Updated");
});
//4
const cona = (awai) => {
  return {
    matchId: awai.matchId,
    match: awai.match,
    year: awai.year,
  };
};
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const sele = `SELECT * FROM match_details WHERE match_id=${matchId};`;
  const awai = await database.get(sele);
  response.send(cona(awai));
});
//5   wait
const conaaaaaaa = (eacdf) => {
  return { matchId: eacdf.match_id, match: eacdf.match, year: eacdf.year };
};
app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const selec = `SELECT
      *
    FROM player_match_score 
      NATURAL JOIN match_details
    WHERE
      player_id = ${playerId};`;
  const alaaa = await database.all(selec);
  response.send(alaaa.map((eacdf) => conaaaaaaa(eacdf)));
});
//6  wait..
const convertPlayerDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
  };
};
app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  const getMatchPlayersQuery = `
    SELECT
      *
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      match_id = ${matchId};`;
  const playersArray = await database.all(getMatchPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertPlayerDbObjectToResponseObject(eachPlayer)
    )
  );
});
//7
app.get("/players/:playerId/playerScores/", async (request, response) => {
  const { playerId } = request.params;
  const getmatchPlayersQuery = `
    SELECT
      player_id AS playerId,
      player_name AS playerName,
      SUM(score) AS totalScore,
      SUM(fours) AS totalFours,
      SUM(sixes) AS totalSixes
    FROM player_match_score
      NATURAL JOIN player_details
    WHERE
      player_id = ${playerId};`;
  const playersMatchDetails = await database.get(getmatchPlayersQuery);
  response.send(playersMatchDetails);
});

module.exports = app;
