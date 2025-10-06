import { storage } from "../storage";
import { randomBytes } from "crypto";
import { db } from "../database";

export class GameService {
  // Check if Friday boost is active
  private static isFridayBoost(): boolean {
    const now = new Date();
    return now.getDay() === 5; // 0 = Sunday, 5 = Friday
  }

  // Get Friday boost multipliers
  private static getFridayBoostMultipliers() {
    return {
      gamblingLuck: 1.25, // 25% better odds
      coinsMultiplier: 1.5, // 50% more coins
      xpMultiplier: 2.0, // 2x XP
    };
  }

  // Blackjack implementation
  static async playBlackjack(username: string, bet: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const isFriday = this.isFridayBoost();
    const boosts = this.getFridayBoostMultipliers();

    // Simple blackjack simulation with Friday boost
    const dealerScore = this.getRandomCardValue();
    const playerScore = this.getRandomCardValue();

    let win = playerScore > dealerScore && playerScore <= 21;

    // Apply Friday boost to gambling luck
    if (isFriday && !win && Math.random() < 0.15) {
      win = true; // 15% chance to turn loss into win on Friday
    }

    let amount = win ? Math.floor(bet * 1.95) : -bet; // House edge

    // Apply Friday coin boost
    if (isFriday && win) {
      amount = Math.floor(amount * boosts.coinsMultiplier);
    }

    // Parse gameStats
    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    const xpGain = win ? (isFriday ? 20 : 10) : 0; // Double XP on Friday

    // Update user coins and stats
    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      gameStats: {
        ...gameStats,
        blackjackWins: (gameStats.blackjackWins || 0) + (win ? 1 : 0),
        blackjackLosses: (gameStats.blackjackLosses || 0) + (win ? 0 : 1),
      },
    });

    // Create transaction
    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Blackjack ${win ? "win" : "loss"}: ${playerScore} vs ${dealerScore}${isFriday ? " [FRIDAY BOOST]" : ""}`,
    });

    return {
      win,
      amount,
      playerScore,
      dealerScore,
      newBalance: user.coins + amount,
      fridayBoost: isFriday,
      xpGained: xpGain,
    };
  }

  // Slots implementation
  static async playSlots(username: string, bet: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const isFriday = this.isFridayBoost();
    const boosts = this.getFridayBoostMultipliers();

    // Slot symbols and their payouts
    const symbols = ["🐸", "💎", "🚀", "💰", "🔥"];
    const reels = [
      symbols[this.getSecureRandom() % symbols.length],
      symbols[this.getSecureRandom() % symbols.length],
      symbols[this.getSecureRandom() % symbols.length],
    ];

    let multiplier = 0;

    // Check for matches
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      // All three match
      if (reels[0] === "💰") multiplier = 50;
      else if (reels[0] === "💎") multiplier = 25;
      else if (reels[0] === "🚀") multiplier = 15;
      else if (reels[0] === "🔥") multiplier = 10;
      else multiplier = 5;
    } else if (
      reels[0] === reels[1] ||
      reels[1] === reels[2] ||
      reels[0] === reels[2]
    ) {
      // Two match
      multiplier = 2;
    }

    let win = multiplier > 0;

    // Apply Friday boost to gambling luck
    if (isFriday && !win && Math.random() < 0.15) {
      win = true;
      multiplier = 2; // Give at least 2x on lucky boost
    }

    let amount = win ? bet * multiplier - bet : -bet;

    // Apply Friday coin boost
    if (isFriday && win) {
      amount = Math.floor(amount * boosts.coinsMultiplier);
    }

    // Parse gameStats
    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    const xpGain = win ? (isFriday ? 20 : 10) : 0;

    // Update user
    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      gameStats: {
        ...gameStats,
        slotsWins: (gameStats.slotsWins || 0) + (win ? 1 : 0),
        slotsLosses: (gameStats.slotsLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Slots ${win ? "win" : "loss"}: ${reels.join(" ")} (${multiplier}x)${isFriday ? " [FRIDAY BOOST]" : ""}`,
    });

    return {
      win,
      amount,
      reels,
      multiplier,
      newBalance: user.coins + amount,
      fridayBoost: isFriday,
      xpGained: xpGain,
    };
  }

  // Coinflip implementation
  static async playCoinflip(
    username: string,
    bet: number,
    choice: "heads" | "tails",
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const isFriday = this.isFridayBoost();
    const boosts = this.getFridayBoostMultipliers();

    const result = this.getSecureRandom() % 2 === 0 ? "heads" : "tails";
    let win = choice === result;

    // Apply Friday boost to gambling luck
    if (isFriday && !win && Math.random() < 0.15) {
      win = true; // 15% chance to turn loss into win on Friday
    }

    let amount = win ? Math.floor(bet * 0.95) : -bet; // 1.95x payout with house edge

    // Apply Friday coin boost
    if (isFriday && win) {
      amount = Math.floor(amount * boosts.coinsMultiplier);
    }

    // Parse gameStats
    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    const xpGain = win ? (isFriday ? 20 : 10) : 0;

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      gameStats: {
        ...gameStats,
        coinflipWins: (gameStats.coinflipWins || 0) + (win ? 1 : 0),
        coinflipLosses: (gameStats.coinflipLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Coinflip ${win ? "win" : "loss"}: ${choice} vs ${result}${isFriday ? " [FRIDAY BOOST]" : ""}`,
    });

    return {
      win,
      amount,
      result,
      choice,
      newBalance: user.coins + amount,
      fridayBoost: isFriday,
      xpGained: xpGain,
    };
  }

  // Trivia questions bank
  private static getTriviaQuestions() {
    return [
      { question: "In what year did 'Rickrolling' become a widespread internet phenomenon?", options: ["2005", "2007", "2009", "2011"], correct: 1 },
      { question: "What is the name of the 'Distracted Boyfriend' meme model?", options: ["Antonio Guillem", "Mario Testino", "Hans Moleman", "Rick Astley"], correct: 0 },
      { question: "Which dog breed is Doge?", options: ["Akita", "Shiba Inu", "Corgi", "Husky"], correct: 1 },
      { question: "What does 'F' mean when typed in chat?", options: ["Follow", "Pay respects", "Fail", "Friend"], correct: 1 },
      { question: "Who created the 'Loss' webcomic meme?", options: ["Tim Buckley", "Randall Munroe", "Matt Groening", "Scott Adams"], correct: 0 },
      { question: "What was the original name of the 'Hide the Pain Harold' meme subject?", options: ["Harold Schmidt", "András Arató", "Wilhelm Scream", "Boris Yeltsin"], correct: 1 },
      { question: "In which year was Pepe the Frog first created?", options: ["2003", "2005", "2008", "2010"], correct: 1 },
      { question: "What is the 'Tide Pod Challenge' an example of?", options: ["Viral dance", "Dangerous internet challenge", "Gaming trend", "Cooking meme"], correct: 1 },
      { question: "Who is the creator of Wojak (Feels Guy)?", options: ["Unknown", "Christian Weston Chandler", "4chan collectively", "Zach Braff"], correct: 0 },
      { question: "What does 'YEET' primarily express?", options: ["Agreement", "Excitement/force", "Sadness", "Confusion"], correct: 1 },
      { question: "The 'This is Fine' dog is from which webcomic?", options: ["Cyanide & Happiness", "Gunshow", "XKCD", "Penny Arcade"], correct: 1 },
      { question: "What year did the 'Harlem Shake' meme trend peak?", options: ["2011", "2013", "2015", "2017"], correct: 1 },
      { question: "Who originally sang 'Never Gonna Give You Up'?", options: ["Rick James", "Rick Springfield", "Rick Astley", "Ricky Martin"], correct: 2 },
      { question: "What does 'SMH' stand for?", options: ["So Much Hate", "Shaking My Head", "Send Me Help", "Super Mario Head"], correct: 1 },
      { question: "The 'Woman Yelling at Cat' meme features a cat named what?", options: ["Grumpy Cat", "Smudge", "Nyan Cat", "Keyboard Cat"], correct: 1 },
      { question: "What is the real name of the 'Overly Attached Girlfriend'?", options: ["Laina Morris", "Emma Watson", "Sarah Anderson", "Kate McKinnon"], correct: 0 },
      { question: "In what year was the first Tweet posted?", options: ["2004", "2006", "2008", "2010"], correct: 1 },
      { question: "What does 'NPC' stand for in meme culture?", options: ["New Pop Culture", "Non-Player Character", "Not Properly Cool", "National Pet Convention"], correct: 1 },
      { question: "Which platform did TikTok merge with in 2018?", options: ["Vine", "Musical.ly", "Dubsmash", "Snapchat"], correct: 1 },
      { question: "What is the 'OK Boomer' meme a response to?", options: ["Good ideas", "Out-of-touch comments", "Greetings", "Agreement"], correct: 1 },
      { question: "Who is the 'Dat Boi' meme character?", options: ["A frog on a unicycle", "A boy dabbing", "A dancing baby", "A surprised cat"], correct: 0 },
      { question: "What does 'FOMO' stand for?", options: ["Fear Of Missing Out", "Fans Of Meme Origins", "Forever On My Own", "First Of Many Outbursts"], correct: 0 },
      { question: "The 'Stonks' meme is intentionally misspelled from what word?", options: ["Stocks", "Strengths", "Stones", "Stunks"], correct: 0 },
      { question: "What was Vine's maximum video length?", options: ["3 seconds", "6 seconds", "10 seconds", "15 seconds"], correct: 1 },
      { question: "Which meme format uses 'Is this a pigeon?'?", options: ["Anime butterfly", "Bird watching", "Pokemon identification", "Nature documentary"], correct: 0 },
      { question: "What does 'GOAT' stand for in internet slang?", options: ["Going Over All Topics", "Greatest Of All Time", "Got Only A Trophy", "Good Old American Tradition"], correct: 1 },
      { question: "The 'Dab' dance move originated from which city?", options: ["New York", "Los Angeles", "Atlanta", "Miami"], correct: 2 },
      { question: "What is 'Copypasta'?", options: ["Italian cuisine", "Repeated text blocks", "Copy-paste software", "A type of noodle"], correct: 1 },
      { question: "Big Chungus is a meme featuring which character?", options: ["Mickey Mouse", "Bugs Bunny", "Scooby Doo", "Tom Cat"], correct: 1 },
      { question: "What does 'TFW' mean?", options: ["Thanks For Waiting", "That Face When", "Too Fast Walking", "The Final Word"], correct: 1 },
      { question: "The 'Coffin Dance' meme originated from which country?", options: ["Brazil", "Nigeria", "Ghana", "Kenya"], correct: 2 },
      { question: "What is the name of the 'Disaster Girl' in the famous meme?", options: ["Zoë Roth", "Chloe Clem", "Sammy Griner", "Success Kid"], correct: 0 },
      { question: "Which year did 'Harambe' memes become popular?", options: ["2014", "2016", "2018", "2020"], correct: 1 },
      { question: "What does 'Stan' mean in internet culture?", options: ["Standard", "Stand alone", "Obsessive fan", "Stay and dance"], correct: 2 },
      { question: "The 'Expanding Brain' meme shows how many brain levels typically?", options: ["2", "4", "6", "8"], correct: 1 },
      { question: "What is a 'Karen' meme stereotype known for?", options: ["Being tech-savvy", "Asking for managers", "Cooking skills", "Fashion sense"], correct: 1 },
      { question: "What does 'Salty' mean in gaming/meme culture?", options: ["Tasty", "Upset/bitter", "Sweaty", "Skilled"], correct: 1 },
      { question: "The 'Surprised Pikachu' face is from which Pokémon episode?", options: ["Episode 1", "Episode 10", "Episode 39", "Episode 100"], correct: 0 },
      { question: "What does 'Bruh' typically express?", options: ["Happiness", "Disbelief/dismay", "Agreement", "Confusion"], correct: 1 },
      { question: "Which meme cat is known for looking perpetually grumpy?", options: ["Keyboard Cat", "Grumpy Cat", "Nyan Cat", "Business Cat"], correct: 1 },
      { question: "What is 'Poggers' used to express?", options: ["Sadness", "Excitement", "Anger", "Sleep"], correct: 1 },
      { question: "The 'Drake' meme template shows Drake doing what?", options: ["Dancing", "Rejecting/approving", "Singing", "Gaming"], correct: 1 },
      { question: "What does 'Ratio' mean on Twitter?", options: ["Math problem", "Getting more likes on reply", "Following ratio", "Tweet frequency"], correct: 1 },
      { question: "Which animal is associated with the 'Press F' meme?", options: ["Dog", "Cat", "None", "Bird"], correct: 2 },
      { question: "What is 'Sheesh' used for?", options: ["To express awe", "To show disgust", "To say hello", "To end conversations"], correct: 0 },
      { question: "The 'Mocking SpongeBob' meme uses which typing style?", options: ["ALL CAPS", "all lowercase", "aLtErNaTiNg CaPs", "no spaces"], correct: 2 },
      { question: "What does 'Cap' mean when someone says 'No cap'?", options: ["Hat", "Lie", "Limit", "Cap lock"], correct: 1 },
      { question: "Which game popularized the 'Victory Royale' phrase?", options: ["PUBG", "Apex Legends", "Fortnite", "Warzone"], correct: 2 },
      { question: "What is the 'Dank' in 'Dank Memes'?", options: ["Wet", "Dark", "High quality/cool", "Database"], correct: 2 },
      { question: "The 'Bernie Sanders mittens' meme came from which event?", options: ["2016 DNC", "2020 Inauguration", "2021 Inauguration", "Vermont Rally"], correct: 2 },
    ];
  }

  // Trivia implementation
  static async playTrivia(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const questions = this.getTriviaQuestions();
    const question = questions[this.getSecureRandom() % questions.length];

    return {
      question: question.question,
      options: question.options,
      questionId: questions.indexOf(question),
    };
  }

  static async submitTriviaAnswer(
    username: string,
    questionId: number,
    answer: number,
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const questions = this.getTriviaQuestions();
    const question = questions[questionId];

    if (!question) {
      throw new Error("Invalid question");
    }

    const isTimeout = answer === -1;
    const win = answer === question.correct;
    let amount = win ? 100 : 0;

    // Parse gameStats
    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    if (win) {
      await storage.updateUser(user.id, {
        coins: user.coins + amount,
        xp: user.xp + 20,
        gameStats: {
          ...gameStats,
          triviaWins: (gameStats.triviaWins || 0) + 1,
        },
      });

      await storage.createTransaction({
        user: username,
        type: "earn",
        amount,
        targetUser: null,
        description: `Trivia correct answer: +${amount} coins, +20 XP`,
      });
    } else if (isTimeout) {
      amount = -75;
      const penaltyAmount = Math.min(75, user.coins);

      await storage.updateUser(user.id, {
        coins: user.coins - penaltyAmount,
        gameStats: {
          ...gameStats,
          triviaLosses: (gameStats.triviaLosses || 0) + 1,
        },
      });

      await storage.createTransaction({
        user: username,
        type: "spend",
        amount: penaltyAmount,
        targetUser: null,
        description: `Trivia timeout penalty: -${penaltyAmount} coins`,
      });

      return {
        win: false,
        amount: -penaltyAmount,
        correctAnswer: question.options[question.correct],
        newBalance: user.coins - penaltyAmount,
        newXP: user.xp,
        timeout: true,
      };
    } else {
      await storage.updateUser(user.id, {
        gameStats: {
          ...gameStats,
          triviaLosses: (gameStats.triviaLosses || 0) + 1,
        },
      });
    }

    return {
      win,
      amount,
      correctAnswer: question.options[question.correct],
      newBalance: user.coins + amount,
      newXP: user.xp + (win ? 20 : 0),
    };
  }

  // Dice game - roll two dice, predict over/under 7
  static async playDice(
    username: string,
    bet: number,
    prediction: "over" | "under" | "seven",
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const isFriday = this.isFridayBoost();
    const boosts = this.getFridayBoostMultipliers();

    const dice1 = (this.getSecureRandom() % 6) + 1;
    const dice2 = (this.getSecureRandom() % 6) + 1;
    const total = dice1 + dice2;

    let win = false;
    let multiplier = 0;

    if (prediction === "seven" && total === 7) {
      win = true;
      multiplier = 5; // 5x for exact seven
    } else if (prediction === "over" && total > 7) {
      win = true;
      multiplier = 1.9; // 1.9x for over
    } else if (prediction === "under" && total < 7) {
      win = true;
      multiplier = 1.9; // 1.9x for under
    }

    // Apply Friday boost to gambling luck
    if (isFriday && !win && Math.random() < 0.15) {
      win = true;
      multiplier = 1.9; // Give at least 1.9x on lucky boost
    }

    let amount = win ? Math.floor(bet * multiplier) - bet : -bet;

    // Apply Friday coin boost
    if (isFriday && win) {
      amount = Math.floor(amount * boosts.coinsMultiplier);
    }

    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    const xpGain = win ? (isFriday ? 20 : 10) : 0;

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      gameStats: {
        ...gameStats,
        diceWins: (gameStats.diceWins || 0) + (win ? 1 : 0),
        diceLosses: (gameStats.diceLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Dice ${win ? "win" : "loss"}: ${dice1}+${dice2}=${total} (${prediction})${isFriday ? " [FRIDAY BOOST]" : ""}`,
    });

    return {
      win,
      amount,
      dice1,
      dice2,
      total,
      prediction,
      multiplier,
      newBalance: user.coins + amount,
      fridayBoost: isFriday,
      xpGained: xpGain,
    };
  }

  // Roulette game - spin the wheel
  static async playRoulette(
    username: string,
    bet: number,
    betType: "red" | "black" | "green" | "odd" | "even" | "high" | "low",
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    const number = this.getSecureRandom() % 37; // 0-36
    const isGreen = number === 0;
    const isRed =
      !isGreen &&
      [
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
      ].includes(number);
    const isBlack = !isGreen && !isRed;
    const isOdd = number > 0 && number % 2 === 1;
    const isEven = number > 0 && number % 2 === 0;
    const isHigh = number >= 19;
    const isLow = number >= 1 && number <= 18;

    let win = false;
    let multiplier = 0;

    if (betType === "green" && isGreen) {
      win = true;
      multiplier = 35; // 35x for green
    } else if (betType === "red" && isRed) {
      win = true;
      multiplier = 1.9; // 1.9x for red/black
    } else if (betType === "black" && isBlack) {
      win = true;
      multiplier = 1.9;
    } else if (betType === "odd" && isOdd) {
      win = true;
      multiplier = 1.9;
    } else if (betType === "even" && isEven) {
      win = true;
      multiplier = 1.9;
    } else if (betType === "high" && isHigh) {
      win = true;
      multiplier = 1.9;
    } else if (betType === "low" && isLow) {
      win = true;
      multiplier = 1.9;
    }

    const amount = win ? Math.floor(bet * multiplier) - bet : -bet;

    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        rouletteWins: (gameStats.rouletteWins || 0) + (win ? 1 : 0),
        rouletteLosses: (gameStats.rouletteLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Roulette ${win ? "win" : "loss"}: ${number} (${betType})`,
    });

    return {
      win,
      amount,
      number,
      color: isGreen ? "green" : isRed ? "red" : "black",
      betType,
      multiplier,
      newBalance: user.coins + amount,
    };
  }

  // Crash game - multiplier increases until crash
  static async playCrash(username: string, bet: number, cashoutAt: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
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

    if (random < 5000)
      crashPoint = 1 + (random / 5000) * 0.5; // 50% chance of 1.0-1.5x
    else if (random < 8000)
      crashPoint = 1.5 + ((random - 5000) / 3000) * 1.5; // 30% chance of 1.5-3x
    else if (random < 9500)
      crashPoint = 3 + ((random - 8000) / 1500) * 7; // 15% chance of 3-10x
    else crashPoint = 10 + ((random - 9500) / 500) * 90; // 5% chance of 10-100x

    const win = cashoutAt <= crashPoint;
    const amount = win ? Math.floor(bet * cashoutAt) - bet : -bet;

    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        crashWins: (gameStats.crashWins || 0) + (win ? 1 : 0),
        crashLosses: (gameStats.crashLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Crash ${win ? "win" : "loss"}: ${cashoutAt.toFixed(2)}x (crashed at ${crashPoint.toFixed(2)}x)`,
    });

    return {
      win,
      amount,
      crashPoint: parseFloat(crashPoint.toFixed(2)),
      cashoutAt,
      newBalance: user.coins + amount,
    };
  }

  // Lottery game - pick 5 numbers (1-50), match winning numbers
  static async playLottery(username: string, bet: number, numbers: number[]) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    if (!numbers || numbers.length !== 5) {
      throw new Error("You must pick exactly 5 numbers");
    }

    // Validate numbers are between 1-50 and unique
    if (numbers.some((n) => n < 1 || n > 50)) {
      throw new Error("Numbers must be between 1 and 50");
    }

    if (new Set(numbers).size !== 5) {
      throw new Error("Numbers must be unique");
    }

    // Generate 5 random winning numbers
    const winningNumbers: number[] = [];
    while (winningNumbers.length < 5) {
      const num = (this.getSecureRandom() % 50) + 1;
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num);
      }
    }

    // Count matches
    const matches = numbers.filter((n) => winningNumbers.includes(n)).length;

    let multiplier = 0;
    let win = false;

    if (matches === 5) {
      multiplier = 100; // 100x for all 5 matches
      win = true;
    } else if (matches === 4) {
      multiplier = 10; // 10x for 4 matches
      win = true;
    } else if (matches === 3) {
      multiplier = 2; // 2x for 3 matches
      win = true;
    }

    const amount = win ? bet * multiplier - bet : -bet;
    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        lotteryWins: (gameStats.lotteryWins || 0) + (win ? 1 : 0),
        lotteryLosses: (gameStats.lotteryLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Lottery ${win ? "win" : "loss"}: ${matches} matches (${multiplier}x)`,
    });

    return {
      win,
      amount,
      matches,
      multiplier,
      playerNumbers: numbers,
      winningNumbers,
      newBalance: user.coins + amount,
    };
  }

  // Mines game - Start a new interactive game
  static async startMines(username: string, bet: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    // Check if user already has an active game
    const existingGame = await db.get(`mines:${username}`);
    if (existingGame) {
      throw new Error("You already have an active mines game. Cash out or finish it first.");
    }

    // Generate mine positions (5 mines in 25 tiles)
    const minePositions: number[] = [];
    while (minePositions.length < 5) {
      const pos = this.getSecureRandom() % 25;
      if (!minePositions.includes(pos)) {
        minePositions.push(pos);
      }
    }

    // Deduct bet from user's coins
    await storage.updateUser(user.id, {
      coins: user.coins - bet,
    });

    // Store game state
    const gameState = {
      username,
      bet,
      minePositions,
      revealedTiles: [],
      gameOver: false,
      startTime: Date.now(),
    };

    await db.set(`mines:${username}`, gameState);

    return {
      gameId: username,
      bet,
      revealedTiles: [],
      multiplier: 1,
      newBalance: user.coins - bet,
    };
  }

  // Mines game - Reveal a specific tile
  static async revealMineTile(username: string, tileIndex: number) {
    const gameState = await db.get(`mines:${username}`);

    if (!gameState) {
      throw new Error("No active mines game found");
    }

    if (gameState.gameOver) {
      throw new Error("Game is already over");
    }

    if (tileIndex < 0 || tileIndex > 24) {
      throw new Error("Invalid tile index");
    }

    if (gameState.revealedTiles.includes(tileIndex)) {
      throw new Error("Tile already revealed");
    }

    // Reveal the tile
    gameState.revealedTiles.push(tileIndex);

    const hitMine = gameState.minePositions.includes(tileIndex);

    if (hitMine) {
      // Game over - lost
      gameState.gameOver = true;
      await db.delete(`mines:${username}`);

      const user = await storage.getUserByUsername(username);
      if (!user) throw new Error("User not found");

      const gameStats =
        typeof user.gameStats === "object" && user.gameStats !== null
          ? (user.gameStats as any)
          : {};

      await storage.updateUser(user.id, {
        gameStats: {
          ...gameStats,
          minesLosses: (gameStats.minesLosses || 0) + 1,
        },
      });

      await storage.createTransaction({
        user: username,
        type: "spend",
        amount: gameState.bet,
        targetUser: null,
        description: `Mines loss: Hit mine at tile ${tileIndex + 1}`,
      });

      return {
        revealed: true,
        tileIndex,
        isMine: true,
        gameOver: true,
        win: false,
        revealedTiles: gameState.revealedTiles,
        minePositions: gameState.minePositions,
        amount: -gameState.bet,
        multiplier: 0,
        newBalance: user.coins,
      };
    }

    // Safe tile - update game state
    await db.set(`mines:${username}`, gameState);

    // Calculate current multiplier
    const multiplier = Math.pow(1.2, gameState.revealedTiles.length);

    return {
      revealed: true,
      tileIndex,
      isMine: false,
      gameOver: false,
      win: false,
      revealedTiles: gameState.revealedTiles,
      multiplier: parseFloat(multiplier.toFixed(2)),
      potentialWin: Math.floor(gameState.bet * multiplier),
    };
  }

  // Mines game - Cash out and collect winnings
  static async cashoutMines(username: string) {
    const gameState = await db.get(`mines:${username}`);

    if (!gameState) {
      throw new Error("No active mines game found");
    }

    if (gameState.gameOver) {
      throw new Error("Game is already over");
    }

    if (gameState.revealedTiles.length === 0) {
      throw new Error("You must reveal at least one tile before cashout");
    }

    // Game over - cashed out successfully
    gameState.gameOver = true;
    await db.delete(`mines:${username}`);

    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Calculate winnings
    const multiplier = Math.pow(1.2, gameState.revealedTiles.length);
    const winnings = Math.floor(gameState.bet * multiplier);

    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    await storage.updateUser(user.id, {
      coins: user.coins + winnings,
      gameStats: {
        ...gameStats,
        minesWins: (gameStats.minesWins || 0) + 1,
      },
    });

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount: winnings - gameState.bet,
      targetUser: null,
      description: `Mines win: ${gameState.revealedTiles.length} tiles (${multiplier.toFixed(2)}x)`,
    });

    return {
      win: true,
      gameOver: true,
      revealedTiles: gameState.revealedTiles,
      minePositions: gameState.minePositions,
      multiplier: parseFloat(multiplier.toFixed(2)),
      amount: winnings - gameState.bet,
      totalWinnings: winnings,
      newBalance: user.coins + winnings,
    };
  }

  // Get active mines game state
  static async getMinesGame(username: string) {
    const gameState = await db.get(`mines:${username}`);

    if (!gameState) {
      return null;
    }

    const multiplier = gameState.revealedTiles.length > 0
      ? Math.pow(1.2, gameState.revealedTiles.length)
      : 1;

    return {
      active: true,
      bet: gameState.bet,
      revealedTiles: gameState.revealedTiles,
      multiplier: parseFloat(multiplier.toFixed(2)),
      potentialWin: Math.floor(gameState.bet * multiplier),
    };
  }

  // Plinko game - ball drops through pegs with different risk levels
  static async playPlinko(
    username: string,
    bet: number,
    risk: "low" | "medium" | "high",
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (bet < 10 || bet > 150000) {
      throw new Error("Bet must be between 10 and 150,000 coins");
    }

    if (user.coins < bet) {
      throw new Error("Insufficient coins");
    }

    if (!["low", "medium", "high"].includes(risk)) {
      throw new Error("Risk must be low, medium, or high");
    }

    // Define multiplier distributions based on risk level
    // 9 slots for plinko landing positions
    const multipliers = {
      low: [1.5, 1.3, 1.1, 1.0, 0.9, 1.0, 1.1, 1.3, 1.5],
      medium: [3.0, 2.0, 1.5, 1.0, 0.5, 1.0, 1.5, 2.0, 3.0],
      high: [10.0, 5.0, 2.0, 1.0, 0.5, 1.0, 2.0, 5.0, 10.0],
    };

    // Simulate ball drop (weighted towards center)
    const random = this.getSecureRandom() % 10000;
    let slotIndex: number;

    if (random < 1000)
      slotIndex = 0; // 10%
    else if (random < 2500)
      slotIndex = 1; // 15%
    else if (random < 4500)
      slotIndex = 2; // 20%
    else if (random < 6500)
      slotIndex = 3; // 20%
    else if (random < 7500)
      slotIndex = 4; // 10%
    else if (random < 8500)
      slotIndex = 5; // 10%
    else if (random < 9000)
      slotIndex = 6; // 5%
    else if (random < 9500)
      slotIndex = 7; // 5%
    else slotIndex = 8; // 5%

    const multiplier = multipliers[risk][slotIndex];
    const win = multiplier >= 1.0;
    const amount = Math.floor(bet * multiplier) - bet;

    const gameStats =
      typeof user.gameStats === "object" && user.gameStats !== null
        ? (user.gameStats as any)
        : {};

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      gameStats: {
        ...gameStats,
        plinkoWins: (gameStats.plinkoWins || 0) + (win ? 1 : 0),
        plinkoLosses: (gameStats.plinkoLosses || 0) + (win ? 0 : 1),
      },
    });

    await storage.createTransaction({
      user: username,
      type: win ? "earn" : "spend",
      amount: Math.abs(amount),
      targetUser: null,
      description: `Plinko ${win ? "win" : "loss"}: ${risk} risk, slot ${slotIndex} (${multiplier}x)`,
    });

    return {
      win,
      amount,
      multiplier,
      slotIndex,
      risk,
      newBalance: user.coins + amount,
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