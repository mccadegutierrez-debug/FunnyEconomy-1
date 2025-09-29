import { storage } from "../storage";
import { randomBytes } from "crypto";

export class GameService {
  // Blackjack implementation
  static async playBlackjack(username: string, bet: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    // Simple blackjack simulation
    const dealerScore = this.getRandomCardValue();
    const playerScore = this.getRandomCardValue();
    
    const win = playerScore > dealerScore && playerScore <= 21;
    const amount = win ? Math.floor(bet * 1.95) : -bet; // House edge
    
    // Parse gameStats
    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};
    
    // Update user coins and stats
    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        blackjackWins: (gameStats.blackjackWins || 0) + (win ? 1 : 0),
        blackjackLosses: (gameStats.blackjackLosses || 0) + (win ? 0 : 1)
      }
    });

    // Create transaction
    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Blackjack ${win ? 'win' : 'loss'}: ${playerScore} vs ${dealerScore}`
    });

    return {
      win,
      amount,
      playerScore,
      dealerScore,
      newBalance: user.coins + amount
    };
  }

  // Slots implementation
  static async playSlots(username: string, bet: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    // Slot symbols and their payouts
    const symbols = ['🐸', '💎', '🚀', '💰', '🔥'];
    const reels = [
      symbols[this.getSecureRandom() % symbols.length],
      symbols[this.getSecureRandom() % symbols.length],
      symbols[this.getSecureRandom() % symbols.length]
    ];

    let multiplier = 0;
    
    // Check for matches
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      // All three match
      if (reels[0] === '💰') multiplier = 50;
      else if (reels[0] === '💎') multiplier = 25;
      else if (reels[0] === '🚀') multiplier = 15;
      else if (reels[0] === '🔥') multiplier = 10;
      else multiplier = 5;
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      // Two match
      multiplier = 2;
    }

    const win = multiplier > 0;
    const amount = win ? bet * multiplier - bet : -bet;

    // Parse gameStats
    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    // Update user
    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        slotsWins: (gameStats.slotsWins || 0) + (win ? 1 : 0),
        slotsLosses: (gameStats.slotsLosses || 0) + (win ? 0 : 1)
      }
    });

    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Slots ${win ? 'win' : 'loss'}: ${reels.join(' ')} (${multiplier}x)`
    });

    return {
      win,
      amount,
      reels,
      multiplier,
      newBalance: user.coins + amount
    };
  }

  // Coinflip implementation
  static async playCoinflip(username: string, bet: number, choice: 'heads' | 'tails') {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const result = this.getSecureRandom() % 2 === 0 ? 'heads' : 'tails';
    const win = choice === result;
    const amount = win ? Math.floor(bet * 0.95) : -bet; // 1.95x payout with house edge

    // Parse gameStats
    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        coinflipWins: (gameStats.coinflipWins || 0) + (win ? 1 : 0),
        coinflipLosses: (gameStats.coinflipLosses || 0) + (win ? 0 : 1)
      }
    });

    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Coinflip ${win ? 'win' : 'loss'}: ${choice} vs ${result}`
    });

    return {
      win,
      amount,
      result,
      choice,
      newBalance: user.coins + amount
    };
  }

  // Trivia implementation
  static async playTrivia(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const questions = [
      { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1 },
      { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], correct: 2 },
      { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
    ];

    const question = questions[this.getSecureRandom() % questions.length];
    
    return {
      question: question.question,
      options: question.options,
      questionId: questions.indexOf(question)
    };
  }

  static async submitTriviaAnswer(username: string, questionId: number, answer: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const questions = [
      { question: "What is the capital of France?", options: ["London", "Paris", "Berlin", "Madrid"], correct: 1 },
      { question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], correct: 2 },
      { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
    ];
    const question = questions[questionId];
    
    if (!question) {
      throw new Error("Invalid question");
    }

    const win = answer === question.correct;
    const amount = win ? 100 : 0; // Fixed reward for trivia

    // Parse gameStats
    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    if (win) {
      await storage.updateUser(user.id, {
        coins: user.coins + amount,
        xp: user.xp + 20,
        gameStats: {
          ...gameStats,
          triviaWins: (gameStats.triviaWins || 0) + 1
        }
      });

      await storage.createTransaction({
        user: username,
        type: 'earn',
        amount,
        targetUser: null,
        description: `Trivia correct answer: +${amount} coins, +20 XP`
      });
    } else {
      await storage.updateUser(user.id, {
        gameStats: {
          ...gameStats,
          triviaLosses: (gameStats.triviaLosses || 0) + 1
        }
      });
    }

    return {
      win,
      amount,
      correctAnswer: question.options[question.correct],
      newBalance: user.coins + amount,
      newXP: user.xp + (win ? 20 : 0)
    };
  }

  // Dice game - roll two dice, predict over/under 7
  static async playDice(username: string, bet: number, prediction: 'over' | 'under' | 'seven') {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const dice1 = (this.getSecureRandom() % 6) + 1;
    const dice2 = (this.getSecureRandom() % 6) + 1;
    const total = dice1 + dice2;
    
    let win = false;
    let multiplier = 0;
    
    if (prediction === 'seven' && total === 7) {
      win = true;
      multiplier = 5; // 5x for exact seven
    } else if (prediction === 'over' && total > 7) {
      win = true;
      multiplier = 1.9; // 1.9x for over
    } else if (prediction === 'under' && total < 7) {
      win = true;
      multiplier = 1.9; // 1.9x for under
    }

    const amount = win ? Math.floor(bet * multiplier) - bet : -bet;

    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        diceWins: (gameStats.diceWins || 0) + (win ? 1 : 0),
        diceLosses: (gameStats.diceLosses || 0) + (win ? 0 : 1)
      }
    });

    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Dice ${win ? 'win' : 'loss'}: ${dice1}+${dice2}=${total} (${prediction})`
    });

    return {
      win,
      amount,
      dice1,
      dice2,
      total,
      prediction,
      multiplier,
      newBalance: user.coins + amount
    };
  }

  // Roulette game - spin the wheel
  static async playRoulette(username: string, bet: number, betType: 'red' | 'black' | 'green' | 'odd' | 'even' | 'high' | 'low') {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const number = this.getSecureRandom() % 37; // 0-36
    const isGreen = number === 0;
    const isRed = !isGreen && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(number);
    const isBlack = !isGreen && !isRed;
    const isOdd = number > 0 && number % 2 === 1;
    const isEven = number > 0 && number % 2 === 0;
    const isHigh = number >= 19;
    const isLow = number >= 1 && number <= 18;

    let win = false;
    let multiplier = 0;

    if (betType === 'green' && isGreen) {
      win = true;
      multiplier = 35; // 35x for green
    } else if (betType === 'red' && isRed) {
      win = true;
      multiplier = 1.9; // 1.9x for red/black
    } else if (betType === 'black' && isBlack) {
      win = true;
      multiplier = 1.9;
    } else if (betType === 'odd' && isOdd) {
      win = true;
      multiplier = 1.9;
    } else if (betType === 'even' && isEven) {
      win = true;
      multiplier = 1.9;
    } else if (betType === 'high' && isHigh) {
      win = true;
      multiplier = 1.9;
    } else if (betType === 'low' && isLow) {
      win = true;
      multiplier = 1.9;
    }

    const amount = win ? Math.floor(bet * multiplier) - bet : -bet;

    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        rouletteWins: (gameStats.rouletteWins || 0) + (win ? 1 : 0),
        rouletteLosses: (gameStats.rouletteLosses || 0) + (win ? 0 : 1)
      }
    });

    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Roulette ${win ? 'win' : 'loss'}: ${number} (${betType})`
    });

    return {
      win,
      amount,
      number,
      color: isGreen ? 'green' : isRed ? 'red' : 'black',
      betType,
      multiplier,
      newBalance: user.coins + amount
    };
  }

  // Crash game - multiplier increases until crash
  static async playCrash(username: string, bet: number, cashoutAt: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 10000) {
      throw new Error("Bet must be between 10 and 10,000 coins");
    }

    if (cashoutAt < 1.1 || cashoutAt > 100) {
      throw new Error("Cashout multiplier must be between 1.1x and 100x");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    // Generate crash point (weighted towards lower values)
    const random = this.getSecureRandom() % 10000;
    let crashPoint: number;
    
    if (random < 5000) crashPoint = 1 + (random / 5000) * 0.5; // 50% chance of 1.0-1.5x
    else if (random < 8000) crashPoint = 1.5 + ((random - 5000) / 3000) * 1.5; // 30% chance of 1.5-3x
    else if (random < 9500) crashPoint = 3 + ((random - 8000) / 1500) * 7; // 15% chance of 3-10x
    else crashPoint = 10 + ((random - 9500) / 500) * 90; // 5% chance of 10-100x

    const win = cashoutAt <= crashPoint;
    const amount = win ? Math.floor(bet * cashoutAt) - bet : -bet;

    const gameStats = typeof user.gameStats === 'object' && user.gameStats !== null ? user.gameStats as any : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        crashWins: (gameStats.crashWins || 0) + (win ? 1 : 0),
        crashLosses: (gameStats.crashLosses || 0) + (win ? 0 : 1)
      }
    });

    await storage.createTransaction({
      user: username,
      type: win ? 'earn' : 'spend',
      amount: Math.abs(amount),
      targetUser: null,
      description: `Crash ${win ? 'win' : 'loss'}: ${cashoutAt.toFixed(2)}x (crashed at ${crashPoint.toFixed(2)}x)`
    });

    return {
      win,
      amount,
      crashPoint: parseFloat(crashPoint.toFixed(2)),
      cashoutAt,
      newBalance: user.coins + amount
    };
  }

  // Helper methods
  private static getRandomCardValue(): number {
    // Simplified blackjack - return value between 15-25
    return 15 + (this.getSecureRandom() % 11);
  }

  private static getSecureRandom(): number {
    return randomBytes(4).readUInt32BE(0);
  }
}
