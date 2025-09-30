// Utility to transform technical notification messages into user-friendly language

interface FriendlyMessage {
  title: string;
  description?: string;
}

/**
 * Picks a random item from an array
 */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Transforms technical notification messages into user-friendly language
 * that basic users can easily understand
 */
export function makeMessageUserFriendly(title: string, description?: string): FriendlyMessage {
  const titleLower = title.toLowerCase();
  
  // Banking/Money Operations
  if (titleLower.includes('deposit successful')) {
    return {
      title: "Money Saved! 💰",
      description: description?.replace(/deposited/gi, 'saved').replace(/bank/gi, 'savings') || "Your money is now safely stored!"
    };
  }
  
  if (titleLower.includes('deposit failed')) {
    const titles = [
      "Bank Said Nope 💸",
      "Deposit Rejected 🚫",
      "Your Money Got Lost 😬",
      "Bank Machine Broke 🔨"
    ];
    const descriptions = [
      "The bank looked at your coins and said 'nah'",
      "Your deposit ghosted harder than your ex",
      "The vault door slammed in your face",
      "Even the ATM is laughing at you right now"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('withdrawal successful')) {
    return {
      title: "Money Retrieved! 💸",
      description: description?.replace(/withdrew/gi, 'took out').replace(/bank/gi, 'savings').replace(/fee/gi, 'small cost') || "You successfully got your money!"
    };
  }
  
  if (titleLower.includes('withdrawal failed')) {
    const titles = [
      "Withdrawal Denied 🚨",
      "Bank Said No 🙅",
      "Money Machine Broke 💔",
      "Access Denied 🔐"
    ];
    const descriptions = [
      "The vault laughed and slammed shut",
      "You're broke, what did you expect?",
      "The bank is keeping your coins hostage",
      "Nice try, but the money's staying put"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('transfer successful')) {
    return {
      title: "Money Sent! 📤",
      description: description?.replace(/sent/gi, 'gave').replace(/fee/gi, 'small cost') || "Your coins were successfully sent!"
    };
  }
  
  if (titleLower.includes('transfer failed')) {
    const titles = [
      "Transfer Rejected 🚫",
      "Money Vanished 👻",
      "Payment Blocked 🛑",
      "Transaction Denied ❌"
    ];
    const descriptions = [
      "That username doesn't exist (unlike your problems)",
      "Your coins got lost in the void",
      "The recipient blocked you before you could send",
      "Money doesn't grow on trees, and it doesn't travel either"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Rob Operations
  if (titleLower.includes('rob successful')) {
    return {
      title: "Steal Successful! 💰",
      description: "You successfully took some coins! Nice work!"
    };
  }
  
  if (titleLower.includes('rob failed')) {
    const titles = [
      "Got Caught Red-Handed 👮",
      "Heist Failed Miserably 🚔",
      "You're a Terrible Thief 🤡",
      "Busted! 🚨"
    ];
    const descriptions = [
      "Smooth criminal you are NOT",
      "They saw you coming from a mile away",
      "Maybe crime isn't your calling",
      "Get rekt, amateur hour is over",
      "You couldn't steal candy from a baby"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Game Results
  if (titleLower.includes('blackjack win')) {
    return {
      title: "Card Game Win! 🎉",
      description: description?.replace(/blackjack/gi, 'card game') || "You won the card game and earned coins!"
    };
  }
  
  if (titleLower.includes('blackjack loss')) {
    const titles = [
      "Blackjack Said No 🃏",
      "Dealer Destroyed You 💀",
      "Cards Weren't in Your Favor 😬",
      "L + Ratio 📉"
    ];
    const descriptions = [
      "Get wrecked, the house always wins",
      "Maybe stick to Uno?",
      "That was embarrassing to watch",
      "Skill issue detected",
      "The cards literally hate you"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('slots win')) {
    return {
      title: "Slot Machine Win! 🎰",
      description: description?.replace(/multiplier/gi, 'bonus') || "The slot machine paid out! You won coins!"
    };
  }
  
  if (titleLower.includes('slots loss')) {
    const titles = [
      "Slots Said Nope 🎰",
      "Machine Ate Your Coins 💸",
      "Big Fat L 😂",
      "Not Even Close 🙅"
    ];
    const descriptions = [
      "The machine is literally mocking you",
      "Your luck ran out faster than your wallet",
      "Maybe gambling isn't your thing",
      "That was painful to watch, not gonna lie",
      "The slots just laughed at your bet"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('coinflip win')) {
    return {
      title: "Coin Toss Win! 🪙",
      description: description || "You guessed correctly! The coin landed your way!"
    };
  }
  
  if (titleLower.includes('coinflip loss')) {
    const titles = [
      "Wrong Side 🪙",
      "Coin Hates You 😤",
      "50/50 and You Lost 💀",
      "Flipped and Flopped 🤦"
    ];
    const descriptions = [
      "It's literally a coin flip and you still lost",
      "The coin said 'not today'",
      "How do you lose a 50/50? Impressive",
      "Maybe try rock-paper-scissors instead",
      "That coin has beef with you personally"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Trivia/Quiz
  if (titleLower.includes('correct answer')) {
    return {
      title: "Right Answer! 🧠",
      description: description?.replace(/XP/gi, 'experience points') || "You got it right and earned rewards!"
    };
  }
  
  if (titleLower.includes('wrong answer')) {
    const titles = [
      "Big Brain Moment... NOT 🧠",
      "Wrong Answer 🚫",
      "Intelligence -100 🤡",
      "Not Even Close 😬"
    ];
    const descriptions = [
      "That answer was wild, bro",
      "Did you even read the question?",
      "Your brain took a day off, huh?",
      "Maybe Google it next time?",
      "Not your best moment, chief"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Daily Rewards
  if (titleLower.includes('daily reward') || titleLower.includes('coin reward')) {
    return {
      title: "Daily Gift Claimed! 🎁",
      description: description || "You got your daily free coins!"
    };
  }
  
  if (titleLower.includes('item reward')) {
    return {
      title: "Free Item! ✨",
      description: description || "You received a free item!"
    };
  }
  
  if (titleLower.includes('lootbox reward')) {
    return {
      title: "Mystery Box! 📦",
      description: description?.replace(/lootbox/gi, 'mystery box') || "You got a mystery box with surprises inside!"
    };
  }
  
  // Work/Economy Actions
  if (titleLower.includes('work') && (titleLower.includes('success') || titleLower.includes('earn'))) {
    return {
      title: "Work Complete! 💼",
      description: description || "You finished your work and earned coins!"
    };
  }
  
  if (titleLower.includes('fish') && titleLower.includes('success')) {
    return {
      title: "Fishing Success! 🎣",
      description: description || "You caught something and earned coins!"
    };
  }
  
  if (titleLower.includes('hunt') && titleLower.includes('success')) {
    return {
      title: "Hunting Success! 🏹",
      description: description || "Your hunt was successful and you earned coins!"
    };
  }
  
  if (titleLower.includes('dig') && titleLower.includes('success')) {
    return {
      title: "Digging Success! ⛏️",
      description: description || "You found something valuable while digging!"
    };
  }
  
  if (titleLower.includes('crime') && titleLower.includes('success')) {
    return {
      title: "Mission Complete! 🕵️",
      description: description?.replace(/crime/gi, 'mission') || "Your mission was successful!"
    };
  }
  
  if (titleLower.includes('stream') && titleLower.includes('success')) {
    return {
      title: "Streaming Success! 📺",
      description: description || "Your stream went well and you earned coins!"
    };
  }
  
  if (titleLower.includes('meme') && titleLower.includes('success')) {
    return {
      title: "Meme Posted! 😂",
      description: description || "Your meme was popular and you earned coins!"
    };
  }
  
  // Level/Progress
  if (titleLower.includes('level') && (titleLower.includes('up') || titleLower.includes('gain'))) {
    return {
      title: "Level Up! 🆙",
      description: description?.replace(/XP/gi, 'experience') || "Congratulations! You reached a new level!"
    };
  }
  
  // Pet-specific failures
  if (titleLower.includes('adoption') && titleLower.includes('fail')) {
    const titles = [
      "Pet Ghosted You 👻",
      "Adoption Rejected 🚫",
      "Pet Said No 🐾",
      "You Got Rejected by a Pixel Pet 😭"
    ];
    const descriptions = [
      "Not even pets want you right now",
      "That pet took one look and ran",
      "Maybe try adopting a rock instead?",
      "The pet swiped left on you",
      "Congratulations, you got rejected by pixels"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('room') && (titleLower.includes('fail') || titleLower.includes('error'))) {
    const titles = [
      "Room Rejected 🚪",
      "No Room for You 🙅",
      "Room Creation Failed 💥",
      "Not Happening 🛑"
    ];
    const descriptions = [
      "That room name is trash, pick another",
      "Room rejected faster than your last relationship",
      "The room builder quit on you",
      "Nice try, but that ain't gonna work"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('sitter') && (titleLower.includes('fail') || titleLower.includes('error'))) {
    const titles = [
      "Sitter Said Nope 👎",
      "Hiring Failed 🚫",
      "They're Too Good for You 😤",
      "Sitter Rejected Your Offer 💀"
    ];
    const descriptions = [
      "They're too expensive for your broke self",
      "That sitter laughed at your offer",
      "Maybe pay them better next time?",
      "They saw your pets and ran away",
      "Not even pet sitters want to work for you"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  // Work/Economy failures  
  if ((titleLower.includes('work') || titleLower.includes('fish') || titleLower.includes('hunt') || 
       titleLower.includes('dig') || titleLower.includes('crime') || titleLower.includes('stream') || 
       titleLower.includes('meme')) && titleLower.includes('fail')) {
    const titles = [
      "Mission Failed 💥",
      "You Got Fired 🔥",
      "Boss Said No 🙅",
      "Work Rejected You 😬"
    ];
    const descriptions = [
      "You're on break... permanently",
      "That was the worst performance ever",
      "Maybe unemployment is your calling?",
      "Your boss is disappointed (again)",
      "You tried, I guess?"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  // General Errors and Failures
  if (titleLower.includes('insufficient') || titleLower.includes('not enough')) {
    const titles = [
      "You're Broke 💸",
      "Wallet Empty 🪫",
      "Insufficient Funds 😭",
      "Too Poor For This 💀"
    ];
    const descriptions = [
      "Maybe get a job?",
      "Your wallet is crying right now",
      "That's embarrassing, not gonna lie",
      "Time to start grinding, chief",
      "Money doesn't grow on trees, unfortunately"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('error') || titleLower.includes('failed')) {
    const titles = [
      "Something Broke 💥",
      "Yikes, That Failed 😬",
      "Error Detected 🚨",
      "Well That Didn't Work 🤷"
    ];
    const descriptions = [
      "Something went wrong, but we're not telling you what",
      "The code took a break, try again later",
      "It's broken, deal with it",
      "Technology said 'not today'",
      "Try again, or don't, we don't care"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Cooldowns/Waiting
  if (titleLower.includes('cooldown') || titleLower.includes('wait')) {
    const titles = [
      "Slow Down There 🕒",
      "Chill Out For a Sec ⏰",
      "Patience, Young Grasshopper 🧘",
      "Not So Fast 🛑"
    ];
    const descriptions = [
      "Bro, you're doing too much. Take a break",
      "The system needs a breather from you",
      "Calm down, you're not that important",
      "Wait your turn like everyone else",
      "You're being too thirsty, relax"
    ];
    return {
      title: pickRandom(titles),
      description: description?.replace(/cooldown/gi, 'waiting time') || pickRandom(descriptions)
    };
  }
  
  // Authentication
  if (titleLower.includes('welcome back')) {
    return {
      title: "Welcome Back! 👋",
      description: description || "Great to see you again!"
    };
  }
  
  if (titleLower.includes('login failed') || titleLower.includes('registration failed')) {
    return {
      title: "Sign In Problem 😕",
      description: "There was an issue signing you in. Please check your details and try again!"
    };
  }
  
  // Shop/Buying
  if (titleLower.includes('purchase') || titleLower.includes('bought') || titleLower.includes('buy')) {
    return {
      title: "Item Purchased! 🛒",
      description: description?.replace(/bought/gi, 'purchased') || "You successfully bought the item!"
    };
  }
  
  // Default: if no specific transformation matches, make it friendlier
  return {
    title: title
      .replace(/API/gi, 'System')
      .replace(/Database/gi, 'System')
      .replace(/Server/gi, 'System')
      .replace(/Error/gi, 'Problem')
      .replace(/Failed/gi, 'Didn\'t Work')
      .replace(/Success/gi, 'Success')
      .replace(/XP/gi, 'Experience'),
    description: description
      ?.replace(/API/gi, 'system')
      .replace(/database/gi, 'system')
      .replace(/server/gi, 'system')
      .replace(/error/gi, 'problem')
      .replace(/failed/gi, 'didn\'t work')
      .replace(/XP/gi, 'experience')
      .replace(/cooldown/gi, 'waiting time')
      .replace(/multiplier/gi, 'bonus')
      .replace(/lootbox/gi, 'mystery box')
      .replace(/withdraw/gi, 'take out')
      .replace(/deposit/gi, 'save')
      .replace(/bank/gi, 'savings')
  };
}

/**
 * Enhanced toast function that automatically makes messages user-friendly
 */
export function userFriendlyToast(
  toast: (options: { title: string; description?: string; variant?: string }) => void,
  title: string,
  description?: string,
  variant?: string
) {
  const friendly = makeMessageUserFriendly(title, description);
  
  toast({
    title: friendly.title,
    description: friendly.description,
    variant
  });
}