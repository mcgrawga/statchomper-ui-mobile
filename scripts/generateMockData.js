// Helper function to generate random stats
function generateStats() {
  const twoPA = Math.floor(Math.random() * 12) + 3;
  const twoPM = Math.floor(Math.random() * twoPA);
  const threePA = Math.floor(Math.random() * 8);
  const threePM = Math.floor(Math.random() * threePA);
  const fta = Math.floor(Math.random() * 6);
  const ftm = Math.floor(Math.random() * fta);
  
  return {
    points: twoPM * 2 + threePM * 3 + ftm,
    twoPointMade: twoPM,
    twoPointAttempts: twoPA,
    twoPointPercentage: twoPA > 0 ? ((twoPM / twoPA) * 100).toFixed(1) : 'n/a',
    threePointMade: threePM,
    threePointAttempts: threePA,
    threePointPercentage: threePA > 0 ? ((threePM / threePA) * 100).toFixed(1) : 'n/a',
    freeThrowMade: ftm,
    freeThrowAttempts: fta,
    freeThrowPercentage: fta > 0 ? ((ftm / fta) * 100).toFixed(1) : 'n/a',
    rebounds: Math.floor(Math.random() * 12) + 1,
    assists: Math.floor(Math.random() * 8),
    steals: Math.floor(Math.random() * 5),
    blocks: Math.floor(Math.random() * 4),
    turnovers: Math.floor(Math.random() * 5),
    fouls: Math.floor(Math.random() * 5) + 1
  };
}

const players = [
  'Jackson Miller', 'Ethan Davis', 'Noah Wilson', 'Liam Anderson', 'Mason Taylor', 'Lucas Brown',
  'Olivia Garcia', 'Sophia Martinez', 'Emma Rodriguez', 'Ava Thompson'
];

const opponents = [
  'Twin Pines Wildcats', 'Riverside Eagles', 'Lincoln Patriots', 'Jefferson Cougars',
  'Madison Bulldogs', 'Westfield Panthers', 'Central Dragons', 'Oakwood Knights',
  'Fairview Trojans', 'Hillside Tigers', 'Valley View Falcons', 'Summit Spartans',
  'Lakeside Lions', 'Mountain Vista Hawks', 'Parkview Bears', 'Greenwood Wolves'
];

const games = [];
let id = 1;

players.forEach(player => {
  const numGames = Math.floor(Math.random() * 10) + 3; // 3-12 games
  for (let i = 0; i < numGames; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    const dateStr = date.toISOString().split('T')[0];
    
    games.push({
      player,
      datePlayed: dateStr,
      opponent: opponents[Math.floor(Math.random() * opponents.length)],
      boxScore: generateStats()
    });
    id++;
  }
});

console.log(JSON.stringify(games, null, 2));
