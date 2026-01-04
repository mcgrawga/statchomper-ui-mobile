// Mock game data matching MongoDB schema structure
export const mockGames = [
  // Emma Johnson games
  {
    _id: '1',
    player: 'Emma Johnson',
    datePlayed: '2025-12-20',
    opponent: 'Lincoln Patriots',
    boxScore: {
      points: 18,
      twoPointMade: 5,
      twoPointAttempts: 9,
      twoPointPercentage: 55.6,
      threePointMade: 2,
      threePointAttempts: 6,
      threePointPercentage: 33.3,
      freeThrowMade: 2,
      freeThrowAttempts: 3,
      freeThrowPercentage: 66.7,
      rebounds: 7,
      assists: 4,
      steals: 3,
      blocks: 1,
      turnovers: 2,
      fouls: 2
    }
  },
  {
    _id: '2',
    player: 'Emma Johnson',
    datePlayed: '2025-12-15',
    opponent: 'Riverside Wildcats',
    boxScore: {
      points: 22,
      twoPointMade: 7,
      twoPointAttempts: 11,
      twoPointPercentage: 63.6,
      threePointMade: 2,
      threePointAttempts: 5,
      threePointPercentage: 40.0,
      freeThrowMade: 2,
      freeThrowAttempts: 2,
      freeThrowPercentage: 100.0,
      rebounds: 9,
      assists: 3,
      steals: 2,
      blocks: 0,
      turnovers: 1,
      fouls: 1
    }
  },
  {
    _id: '3',
    player: 'Emma Johnson',
    datePlayed: '2025-12-10',
    opponent: 'Jefferson Eagles',
    boxScore: {
      points: 15,
      twoPointMade: 6,
      twoPointAttempts: 10,
      twoPointPercentage: 60.0,
      threePointMade: 1,
      threePointAttempts: 4,
      threePointPercentage: 25.0,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 5,
      assists: 6,
      steals: 1,
      blocks: 0,
      turnovers: 3,
      fouls: 2
    }
  },
  
  // Sarah Martin games
  {
    _id: '4',
    player: 'Sarah Martin',
    datePlayed: '2025-12-21',
    opponent: 'Madison Bulldogs',
    boxScore: {
      points: 24,
      twoPointMade: 8,
      twoPointAttempts: 13,
      twoPointPercentage: 61.5,
      threePointMade: 2,
      threePointAttempts: 7,
      threePointPercentage: 28.6,
      freeThrowMade: 2,
      freeThrowAttempts: 4,
      freeThrowPercentage: 50.0,
      rebounds: 6,
      assists: 5,
      steals: 4,
      blocks: 1,
      turnovers: 2,
      fouls: 3
    }
  },
  {
    _id: '5',
    player: 'Sarah Martin',
    datePlayed: '2025-12-14',
    opponent: 'Westfield Panthers',
    boxScore: {
      points: 19,
      twoPointMade: 6,
      twoPointAttempts: 10,
      twoPointPercentage: 60.0,
      threePointMade: 1,
      threePointAttempts: 5,
      threePointPercentage: 20.0,
      freeThrowMade: 4,
      freeThrowAttempts: 5,
      freeThrowPercentage: 80.0,
      rebounds: 8,
      assists: 4,
      steals: 2,
      blocks: 0,
      turnovers: 1,
      fouls: 2
    }
  },
  {
    _id: '6',
    player: 'Sarah Martin',
    datePlayed: '2025-12-08',
    opponent: 'Central Cougars',
    boxScore: {
      points: 27,
      twoPointMade: 9,
      twoPointAttempts: 14,
      twoPointPercentage: 64.3,
      threePointMade: 3,
      threePointAttempts: 8,
      threePointPercentage: 37.5,
      freeThrowMade: 0,
      freeThrowAttempts: 0,
      freeThrowPercentage: 'n/a',
      rebounds: 10,
      assists: 7,
      steals: 3,
      blocks: 2,
      turnovers: 2,
      fouls: 1
    }
  },

  // Michael Jones games
  {
    _id: '7',
    player: 'Michael Jones',
    datePlayed: '2025-12-19',
    opponent: 'Oakwood Knights',
    boxScore: {
      points: 21,
      twoPointMade: 7,
      twoPointAttempts: 12,
      twoPointPercentage: 58.3,
      threePointMade: 2,
      threePointAttempts: 6,
      threePointPercentage: 33.3,
      freeThrowMade: 1,
      freeThrowAttempts: 2,
      freeThrowPercentage: 50.0,
      rebounds: 11,
      assists: 3,
      steals: 1,
      blocks: 3,
      turnovers: 2,
      fouls: 4
    }
  },
  {
    _id: '8',
    player: 'Michael Jones',
    datePlayed: '2025-12-12',
    opponent: 'Fairview Trojans',
    boxScore: {
      points: 16,
      twoPointMade: 6,
      twoPointAttempts: 11,
      twoPointPercentage: 54.5,
      threePointMade: 1,
      threePointAttempts: 4,
      threePointPercentage: 25.0,
      freeThrowMade: 1,
      freeThrowAttempts: 3,
      freeThrowPercentage: 33.3,
      rebounds: 13,
      assists: 2,
      steals: 0,
      blocks: 2,
      turnovers: 3,
      fouls: 3
    }
  },
  {
    _id: '9',
    player: 'Michael Jones',
    datePlayed: '2025-12-06',
    opponent: 'Hillside Dragons',
    boxScore: {
      points: 20,
      twoPointMade: 8,
      twoPointAttempts: 13,
      twoPointPercentage: 61.5,
      threePointMade: 0,
      threePointAttempts: 2,
      threePointPercentage: 0.0,
      freeThrowMade: 4,
      freeThrowAttempts: 6,
      freeThrowPercentage: 66.7,
      rebounds: 9,
      assists: 4,
      steals: 2,
      blocks: 1,
      turnovers: 1,
      fouls: 2
    }
  },
];
