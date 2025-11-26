// netlify/functions/players.js

const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  const players = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../data/players.json"), "utf8")
  );

  const { name, team, pos, minYds, minTD } = event.queryStringParameters || {};
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
      p => p.Team && p.Team.toLowerCase().includes(team.toLowerCase())
    );
  }

  // Filter by position
  if (pos) {
    results = results.filter(
      p => p.Pos && p.Pos.toLowerCase() === pos.toLowerCase()
    );
  }

  // Filter by yards (use "Yds" column)
  if (minYds) {
    results = results.filter(
      p => parseFloat(p.Yds || 0) >= parseFloat(minYds)
    );
  }

  // Filter by touchdowns (use "TD" column)
  if (minTD) {
    results = results.filter(
      p => parseInt(p.TD || 0) >= parseInt(minTD)
    );
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2)
  };
};
