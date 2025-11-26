// netlify/functions/players.js
const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  try {
    // Load JSON file from the same folder as this function
    const filePath = path.join(__dirname, "players.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const players = JSON.parse(raw);

    const { name, team, pos, minYds, minTD } = event.queryStringParameters || {};
    let results = players;

    if (name) {
      results = results.filter(
        p => p.Player && p.Player.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (team) {
      results = results.filter(
        p => p.Team && p.Team.toLowerCase().includes(team.toLowerCase())
      );
    }
    if (pos) {
      results = results.filter(
        p => p.Pos && p.Pos.toLowerCase() === pos.toLowerCase()
      );
    }
    if (minYds) {
      results = results.filter(
        p => parseFloat(p.Yds || 0) >= parseFloat(minYds)
      );
    }
    if (minTD) {
      results = results.filter(
        p => parseInt(p.TD || 0) >= parseInt(minTD)
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify(results, null, 2)
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load players.json", details: err.message })
    };
  }
};
