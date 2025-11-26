// netlify/functions/players.js

const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  // Load the JSON data from the /data folder
  const players = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../data/players.json"), "utf8")
  );

  const { name, team, pos, minPassYds, minRushYds, minRecYds } = event.queryStringParameters || {};
  let results = players;

  // Filter by player name
  if (name) {
    results = results.filter(
      p => p.Player && p.Player.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by team
  if (team) {
    results = results.filter(
      p => p.Team && p.Team.toLowerCase() === team.toLowerCase()
    );
  }

  // Filter by position
  if (pos) {
    results = results.filter(
      p => p.Pos && p.Pos.toLowerCase() === pos.toLowerCase()
    );
  }

  // Filter by stat thresholds
  if (minPassYds) {
    results = results.filter(
      p => parseInt(p.PassYds || 0) >= parseInt(minPassYds)
    );
  }
  if (minRushYds) {
    results = results.filter(
      p => parseInt(p.RushYds || 0) >= parseInt(minRushYds)
    );
  }
  if (minRecYds) {
    results = results.filter(
      p => parseInt(p.RecYds || 0) >= parseInt(minRecYds)
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2)
  };
};
