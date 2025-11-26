// netlify/functions/players.js

const players = require("./players.json"); 
// ✅ players.json must be in the same folder as players.js

exports.handler = async (event, context) => {
  const { name, team, pos, minPassYds, minRushYds, minRecYds } = event.queryStringParameters;

  let results = players;

  // Filter by player name
  if (name) {
    results = results.filter(p => p.Player && p.Player.toLowerCase().includes(name.toLowerCase()));
  }

  // Filter by team
  if (team) {
    results = results.filter(p => p.Team && p.Team.toLowerCase() === team.toLowerCase());
  }

  // Filter by position
  if (pos) {
    results = results.filter(p => p.Pos && p.Pos.toLowerCase() === pos.toLowerCase());
  }

  // Filter by stat thresholds
  if (minPassYds) {
    results = results.filter(p => parseInt(p.PassYds || 0) >= parseInt(minPassYds));
  }
  if (minRushYds) {
    results = results.filter(p => parseInt(p.RushYds || 0) >= parseInt(minRushYds));
  }
  if (minRecYds) {
    results = results.filter(p => parseInt(p.RecYds || 0) >= parseInt(minRecYds));
  }

  return {
    statusCode: 200,
    body: JSON.stringify(results, null, 2)
  };
};
