// Mock game data matching MongoDB schema structure
export const mockGames = [
  // LeBron James games
  {
    _id: '1',
    player: 'LeBron James',
    datePlayed: '2025-12-20',
    opponent: 'Warriors',
    boxScore: {
      points: 28,
      twoPointMade: 8,
      twoPointAttempts: 14,
      twoPointPercentage: 57.1,
      threePointMade: 3,
      threePointAttempts: 7,
      threePointPercentage: 42.9,
      freeThrowMade: 3,
      freeThrowAttempts: 4,
      freeThrowPercentage: 75.0,
      rebounds: 12,
      assists: 8,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      fouls: 2
    }
  },
  {
    _id: '2',
    player: 'LeBron James',
    datePlayed: '2025-12-18',
    opponent: 'Celtics',
    boxScore: {
      points: 32,
      twoPointMade: 10,
      twoPointAttempts: 16,
      twoPointPercentage: 62.5,
      threePointMade: 4,
      threePointAttempts: 9,
      threePointPercentage: 44.4,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 7,
      assists: 11,
      steals: 1,
      blocks: 2,
      turnovers: 2,
      fouls: 1
    }
  },
  {
    _id: '3',
    player: 'LeBron James',
    datePlayed: '2025-12-15',
    opponent: 'Nets',
    boxScore: {
      points: 25,
      twoPointMade: 9,
      twoPointAttempts: 15,
      twoPointPercentage: 60.0,
      threePointMade: 2,
      threePointAttempts: 5,
      threePointPercentage: 40.0,
      freeThrowMade: 1,
      freeThrowAttempts: 2,
      freeThrowPercentage: 50.0,
      rebounds: 9,
      assists: 6,
      steals: 3,
      blocks: 0,
      turnovers: 4,
      fouls: 3
    }
  },
  
  // Stephen Curry games
  {
    _id: '4',
    player: 'Stephen Curry',
    datePlayed: '2025-12-22',
    opponent: 'Lakers',
    boxScore: {
      points: 35,
      twoPointMade: 5,
      twoPointAttempts: 8,
      twoPointPercentage: 62.5,
      threePointMade: 7,
      threePointAttempts: 15,
      threePointPercentage: 46.7,
      freeThrowMade: 6,
      freeThrowAttempts: 6,
      freeThrowPercentage: 100.0,
      rebounds: 4,
      assists: 7,
      steals: 2,
      blocks: 0,
      turnovers: 2,
      fouls: 2
    }
  },
  {
    _id: '5',
    player: 'Stephen Curry',
    datePlayed: '2025-12-19',
    opponent: 'Mavericks',
    boxScore: {
      points: 41,
      twoPointMade: 6,
      twoPointAttempts: 10,
      twoPointPercentage: 60.0,
      threePointMade: 9,
      threePointAttempts: 18,
      threePointPercentage: 50.0,
      freeThrowMade: 2,
      freeThrowAttempts: 2,
      freeThrowPercentage: 100.0,
      rebounds: 5,
      assists: 4,
      steals: 1,
      blocks: 0,
      turnovers: 1,
      fouls: 1
    }
  },
  
  // Giannis Antetokounmpo games
  {
    _id: '6',
    player: 'Giannis Antetokounmpo',
    datePlayed: '2025-12-21',
    opponent: 'Heat',
    boxScore: {
      points: 38,
      twoPointMade: 15,
      twoPointAttempts: 22,
      twoPointPercentage: 68.2,
      threePointMade: 1,
      threePointAttempts: 3,
      threePointPercentage: 33.3,
      freeThrowMade: 5,
      freeThrowAttempts: 8,
      freeThrowPercentage: 62.5,
      rebounds: 15,
      assists: 5,
      steals: 2,
      blocks: 3,
      turnovers: 3,
      fouls: 4
    }
  },
  {
    _id: '7',
    player: 'Giannis Antetokounmpo',
    datePlayed: '2025-12-17',
    opponent: 'Bucks',
    boxScore: {
      points: 42,
      twoPointMade: 17,
      twoPointAttempts: 25,
      twoPointPercentage: 68.0,
      threePointMade: 0,
      threePointAttempts: 2,
      threePointPercentage: 0.0,
      freeThrowMade: 8,
      freeThrowAttempts: 12,
      freeThrowPercentage: 66.7,
      rebounds: 18,
      assists: 3,
      steals: 1,
      blocks: 4,
      turnovers: 2,
      fouls: 3
    }
  },
  {
    _id: '8',
    player: 'Giannis Antetokounmpo',
    datePlayed: '2025-12-14',
    opponent: 'Pacers',
    boxScore: {
      points: 31,
      twoPointMade: 12,
      twoPointAttempts: 19,
      twoPointPercentage: 63.2,
      threePointMade: 1,
      threePointAttempts: 4,
      threePointPercentage: 25.0,
      freeThrowMade: 4,
      freeThrowAttempts: 7,
      freeThrowPercentage: 57.1,
      rebounds: 13,
      assists: 6,
      steals: 2,
      blocks: 2,
      turnovers: 4,
      fouls: 2
    }
  },
  
  // Kevin Durant games
  {
    _id: '9',
    player: 'Kevin Durant',
    datePlayed: '2025-12-23',
    opponent: 'Clippers',
    boxScore: {
      points: 33,
      twoPointMade: 10,
      twoPointAttempts: 15,
      twoPointPercentage: 66.7,
      threePointMade: 3,
      threePointAttempts: 8,
      threePointPercentage: 37.5,
      freeThrowMade: 4,
      freeThrowAttempts: 4,
      freeThrowPercentage: 100.0,
      rebounds: 8,
      assists: 6,
      steals: 1,
      blocks: 2,
      turnovers: 2,
      fouls: 1
    }
  },
  {
    _id: '10',
    player: 'Kevin Durant',
    datePlayed: '2025-12-20',
    opponent: 'Spurs',
    boxScore: {
      points: 29,
      twoPointMade: 9,
      twoPointAttempts: 14,
      twoPointPercentage: 64.3,
      threePointMade: 2,
      threePointAttempts: 6,
      threePointPercentage: 33.3,
      freeThrowMade: 5,
      freeThrowAttempts: 6,
      freeThrowPercentage: 83.3,
      rebounds: 7,
      assists: 4,
      steals: 2,
      blocks: 1,
      turnovers: 1,
      fouls: 2
    }
  },
  
  // Luka Doncic games
  {
    _id: '11',
    player: 'Luka Doncic',
    datePlayed: '2025-12-22',
    opponent: 'Rockets',
    boxScore: {
      points: 36,
      twoPointMade: 11,
      twoPointAttempts: 18,
      twoPointPercentage: 61.1,
      threePointMade: 4,
      threePointAttempts: 10,
      threePointPercentage: 40.0,
      freeThrowMade: 2,
      freeThrowAttempts: 3,
      freeThrowPercentage: 66.7,
      rebounds: 9,
      assists: 12,
      steals: 2,
      blocks: 0,
      turnovers: 4,
      fouls: 3
    }
  },
  {
    _id: '12',
    player: 'Luka Doncic',
    datePlayed: '2025-12-18',
    opponent: 'Thunder',
    boxScore: {
      points: 41,
      twoPointMade: 13,
      twoPointAttempts: 20,
      twoPointPercentage: 65.0,
      threePointMade: 5,
      threePointAttempts: 12,
      threePointPercentage: 41.7,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 11,
      assists: 10,
      steals: 1,
      blocks: 1,
      turnovers: 3,
      fouls: 2
    }
  },
  
  // Joel Embiid games
  {
    _id: '13',
    player: 'Joel Embiid',
    datePlayed: '2025-12-21',
    opponent: 'Knicks',
    boxScore: {
      points: 34,
      twoPointMade: 12,
      twoPointAttempts: 20,
      twoPointPercentage: 60.0,
      threePointMade: 2,
      threePointAttempts: 5,
      threePointPercentage: 40.0,
      freeThrowMade: 6,
      freeThrowAttempts: 8,
      freeThrowPercentage: 75.0,
      rebounds: 14,
      assists: 3,
      steals: 1,
      blocks: 3,
      turnovers: 3,
      fouls: 4
    }
  },
  {
    _id: '14',
    player: 'Joel Embiid',
    datePlayed: '2025-12-19',
    opponent: 'Raptors',
    boxScore: {
      points: 38,
      twoPointMade: 14,
      twoPointAttempts: 22,
      twoPointPercentage: 63.6,
      threePointMade: 1,
      threePointAttempts: 4,
      threePointPercentage: 25.0,
      freeThrowMade: 7,
      freeThrowAttempts: 9,
      freeThrowPercentage: 77.8,
      rebounds: 16,
      assists: 2,
      steals: 0,
      blocks: 4,
      turnovers: 2,
      fouls: 3
    }
  },
  
  // Nikola Jokic games
  {
    _id: '15',
    player: 'Nikola Jokic',
    datePlayed: '2025-12-23',
    opponent: 'Jazz',
    boxScore: {
      points: 27,
      twoPointMade: 10,
      twoPointAttempts: 16,
      twoPointPercentage: 62.5,
      threePointMade: 2,
      threePointAttempts: 4,
      threePointPercentage: 50.0,
      freeThrowMade: 1,
      freeThrowAttempts: 2,
      freeThrowPercentage: 50.0,
      rebounds: 13,
      assists: 14,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      fouls: 2
    }
  },
  {
    _id: '16',
    player: 'Nikola Jokic',
    datePlayed: '2025-12-20',
    opponent: 'Trail Blazers',
    boxScore: {
      points: 31,
      twoPointMade: 12,
      twoPointAttempts: 18,
      twoPointPercentage: 66.7,
      threePointMade: 1,
      threePointAttempts: 3,
      threePointPercentage: 33.3,
      freeThrowMade: 4,
      freeThrowAttempts: 5,
      freeThrowPercentage: 80.0,
      rebounds: 15,
      assists: 11,
      steals: 1,
      blocks: 2,
      turnovers: 2,
      fouls: 3
    }
  },
  
  // Jayson Tatum games
  {
    _id: '17',
    player: 'Jayson Tatum',
    datePlayed: '2025-12-22',
    opponent: 'Hawks',
    boxScore: {
      points: 30,
      twoPointMade: 9,
      twoPointAttempts: 15,
      twoPointPercentage: 60.0,
      threePointMade: 3,
      threePointAttempts: 9,
      threePointPercentage: 33.3,
      freeThrowMade: 3,
      freeThrowAttempts: 4,
      freeThrowPercentage: 75.0,
      rebounds: 8,
      assists: 5,
      steals: 2,
      blocks: 1,
      turnovers: 2,
      fouls: 2
    }
  },
  {
    _id: '18',
    player: 'Jayson Tatum',
    datePlayed: '2025-12-19',
    opponent: 'Magic',
    boxScore: {
      points: 28,
      twoPointMade: 8,
      twoPointAttempts: 14,
      twoPointPercentage: 57.1,
      threePointMade: 4,
      threePointAttempts: 10,
      threePointPercentage: 40.0,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 7,
      assists: 6,
      steals: 1,
      blocks: 0,
      turnovers: 3,
      fouls: 1
    }
  },
  
  // Damian Lillard games
  {
    _id: '19',
    player: 'Damian Lillard',
    datePlayed: '2025-12-21',
    opponent: 'Grizzlies',
    boxScore: {
      points: 32,
      twoPointMade: 7,
      twoPointAttempts: 12,
      twoPointPercentage: 58.3,
      threePointMade: 5,
      threePointAttempts: 13,
      threePointPercentage: 38.5,
      freeThrowMade: 3,
      freeThrowAttempts: 3,
      freeThrowPercentage: 100.0,
      rebounds: 4,
      assists: 8,
      steals: 1,
      blocks: 0,
      turnovers: 2,
      fouls: 2
    }
  },
  {
    _id: '20',
    player: 'Damian Lillard',
    datePlayed: '2025-12-18',
    opponent: 'Pelicans',
    boxScore: {
      points: 38,
      twoPointMade: 8,
      twoPointAttempts: 13,
      twoPointPercentage: 61.5,
      threePointMade: 6,
      threePointAttempts: 15,
      threePointPercentage: 40.0,
      freeThrowMade: 4,
      freeThrowAttempts: 4,
      freeThrowPercentage: 100.0,
      rebounds: 3,
      assists: 10,
      steals: 2,
      blocks: 0,
      turnovers: 3,
      fouls: 1
    }
  },
  
  // Anthony Davis games
  {
    _id: '21',
    player: 'Anthony Davis',
    datePlayed: '2025-12-23',
    opponent: 'Suns',
    boxScore: {
      points: 35,
      twoPointMade: 13,
      twoPointAttempts: 20,
      twoPointPercentage: 65.0,
      threePointMade: 1,
      threePointAttempts: 3,
      threePointPercentage: 33.3,
      freeThrowMade: 6,
      freeThrowAttempts: 8,
      freeThrowPercentage: 75.0,
      rebounds: 12,
      assists: 2,
      steals: 2,
      blocks: 4,
      turnovers: 1,
      fouls: 3
    }
  },
  {
    _id: '22',
    player: 'Anthony Davis',
    datePlayed: '2025-12-20',
    opponent: 'Kings',
    boxScore: {
      points: 29,
      twoPointMade: 11,
      twoPointAttempts: 18,
      twoPointPercentage: 61.1,
      threePointMade: 0,
      threePointAttempts: 2,
      threePointPercentage: 0.0,
      freeThrowMade: 7,
      freeThrowAttempts: 10,
      freeThrowPercentage: 70.0,
      rebounds: 14,
      assists: 3,
      steals: 1,
      blocks: 3,
      turnovers: 2,
      fouls: 4
    }
  },
  
  // Kawhi Leonard games
  {
    _id: '23',
    player: 'Kawhi Leonard',
    datePlayed: '2025-12-22',
    opponent: 'Timberwolves',
    boxScore: {
      points: 26,
      twoPointMade: 9,
      twoPointAttempts: 15,
      twoPointPercentage: 60.0,
      threePointMade: 2,
      threePointAttempts: 6,
      threePointPercentage: 33.3,
      freeThrowMade: 2,
      freeThrowAttempts: 2,
      freeThrowPercentage: 100.0,
      rebounds: 7,
      assists: 4,
      steals: 3,
      blocks: 1,
      turnovers: 1,
      fouls: 2
    }
  },
  {
    _id: '24',
    player: 'Kawhi Leonard',
    datePlayed: '2025-12-19',
    opponent: 'Hornets',
    boxScore: {
      points: 31,
      twoPointMade: 10,
      twoPointAttempts: 16,
      twoPointPercentage: 62.5,
      threePointMade: 3,
      threePointAttempts: 7,
      threePointPercentage: 42.9,
      freeThrowMade: 2,
      freeThrowAttempts: 3,
      freeThrowPercentage: 66.7,
      rebounds: 6,
      assists: 5,
      steals: 2,
      blocks: 2,
      turnovers: 2,
      fouls: 1
    }
  },
  
  // Devin Booker games
  {
    _id: '25',
    player: 'Devin Booker',
    datePlayed: '2025-12-21',
    opponent: 'Lakers',
    boxScore: {
      points: 34,
      twoPointMade: 10,
      twoPointAttempts: 17,
      twoPointPercentage: 58.8,
      threePointMade: 4,
      threePointAttempts: 11,
      threePointPercentage: 36.4,
      freeThrowMade: 2,
      freeThrowAttempts: 2,
      freeThrowPercentage: 100.0,
      rebounds: 5,
      assists: 7,
      steals: 1,
      blocks: 0,
      turnovers: 3,
      fouls: 2
    }
  },
  {
    _id: '26',
    player: 'Devin Booker',
    datePlayed: '2025-12-18',
    opponent: 'Warriors',
    boxScore: {
      points: 29,
      twoPointMade: 9,
      twoPointAttempts: 15,
      twoPointPercentage: 60.0,
      threePointMade: 3,
      threePointAttempts: 8,
      threePointPercentage: 37.5,
      freeThrowMade: 2,
      freeThrowAttempts: 3,
      freeThrowPercentage: 66.7,
      rebounds: 4,
      assists: 9,
      steals: 2,
      blocks: 0,
      turnovers: 2,
      fouls: 3
    }
  },
  
  // Jaylen Brown games
  {
    _id: '27',
    player: 'Jaylen Brown',
    datePlayed: '2025-12-20',
    opponent: 'Cavaliers',
    boxScore: {
      points: 27,
      twoPointMade: 9,
      twoPointAttempts: 14,
      twoPointPercentage: 64.3,
      threePointMade: 3,
      threePointAttempts: 7,
      threePointPercentage: 42.9,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 6,
      assists: 4,
      steals: 2,
      blocks: 1,
      turnovers: 2,
      fouls: 2
    }
  },
  {
    _id: '28',
    player: 'Jaylen Brown',
    datePlayed: '2025-12-17',
    opponent: 'Wizards',
    boxScore: {
      points: 32,
      twoPointMade: 11,
      twoPointAttempts: 16,
      twoPointPercentage: 68.8,
      threePointMade: 2,
      threePointAttempts: 6,
      threePointPercentage: 33.3,
      freeThrowMade: 4,
      freeThrowAttempts: 5,
      freeThrowPercentage: 80.0,
      rebounds: 7,
      assists: 3,
      steals: 3,
      blocks: 0,
      turnovers: 1,
      fouls: 3
    }
  }
];
