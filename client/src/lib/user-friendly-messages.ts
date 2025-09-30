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
      "Bank Said Nah Bruh 💸",
      "Deposit Rejected LMAO 🚫",
      "Your Money Dipped 😬",
      "Bank Machine Said Nope 🔨"
    ];
    const descriptions = [
      "The bank took one look and said 'absolutely not' lmao",
      "Your deposit ghosted harder than your ex, fr fr",
      "L + ratio + the vault door literally slammed in your face",
      "Even the ATM is laughing at you rn, no cap"
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
      "Withdrawal Denied LMAO 🚨",
      "Bank Said Hell No 🙅",
      "Money Machine Broke Fr 💔",
      "Access Denied Bruh 🔐"
    ];
    const descriptions = [
      "The vault literally laughed and slammed shut lmao",
      "You're broke af, what did you expect? 💀",
      "The bank is holding your coins hostage fr fr",
      "Nice try but the money's staying put, no cap"
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
      "Transfer Rejected LMAO 🚫",
      "Money Vanished Fr 👻",
      "Payment Blocked Bruh 🛑",
      "Transaction Denied 💀"
    ];
    const descriptions = [
      "That username doesn't exist lmao (unlike your problems)",
      "Your coins got lost in the void fr fr",
      "The recipient blocked you before you could even send 😭",
      "Skill issue detected, money said bye bye"
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
      "Got Caught LMAO 👮",
      "Heist Failed So Bad 🚔",
      "You're Trash at This 🤡",
      "Busted Fr Fr 🚨"
    ];
    const descriptions = [
      "Smooth criminal you are NOT, no cap 💀",
      "They saw you coming from a mile away lmao",
      "Maybe crime isn't your calling bruh",
      "Get rekt kid, amateur hour is over fr",
      "You couldn't steal candy from a baby, that's embarrassing"
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
      "Blackjack Said Nah LMAO 🃏",
      "Dealer Demolished You Fr 💀",
      "Cards Hate You Bruh 😬",
      "L + Ratio + No Skill 📉"
    ];
    const descriptions = [
      "Get absolutely demolished, the house always wins no cap",
      "Maybe stick to Uno? Or go fish? Literally anything else lmao",
      "That was painful to watch fr fr 😭",
      "Massive skill issue detected",
      "The cards literally hate you on a personal level bruh"
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
      "Slots Said Nah LMAO 🎰",
      "Machine Ate Your Coins Fr 💸",
      "Massive L Bruh 😂",
      "Not Even Close 💀"
    ];
    const descriptions = [
      "The machine is literally mocking you rn lmao",
      "Your luck ran out faster than your wallet fr fr",
      "Maybe gambling isn't your thing chief, no cap",
      "That was painful to watch ngl 😭",
      "The slots straight up laughed at your bet bruh"
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
      "Wrong Side LMAO 🪙",
      "Coin Hates You Fr 😤",
      "50/50 and Still Lost 💀",
      "Flipped and Flopped Bruh 🤦"
    ];
    const descriptions = [
      "It's literally a coin flip and you STILL lost lmao",
      "The coin said 'absolutely not' fr fr",
      "How do you lose a 50/50? That's actually impressive ngl",
      "Maybe try rock-paper-scissors instead bruh",
      "That coin has personal beef with you, no cap 💀"
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
      "Wrong Answer LMAO 🚫",
      "Intelligence -1000 💀",
      "Not Even Close Bruh 😬"
    ];
    const descriptions = [
      "That answer was wild af, no cap 💀",
      "Did you even read the question lmao",
      "Your brain took a day off fr fr",
      "Maybe Google it next time? Just a thought",
      "Not your best moment chief, that was embarrassing"
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
      "Pet Ghosted You Fr 👻",
      "Adoption Rejected LMAO 🚫",
      "Pet Said Nah Bruh 🐾",
      "Rejected by Pixels 💀"
    ];
    const descriptions = [
      "Not even pets want you rn lmao",
      "That pet took one look and dipped fr fr",
      "Maybe try adopting a rock instead? No cap",
      "The pet literally swiped left on you 😭",
      "You got rejected by pixels, that's wild bruh"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('room') && (titleLower.includes('fail') || titleLower.includes('error'))) {
    const titles = [
      "Room Rejected LMAO 🚪",
      "No Room for You Fr 🙅",
      "Room Creation Failed 💥",
      "Not Happening Bruh 🛑"
    ];
    const descriptions = [
      "That room name is straight up trash, pick another lmao",
      "Room rejected faster than your last relationship fr fr 💀",
      "The room builder literally quit on you",
      "Nice try but that ain't gonna work, no cap"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('sitter') && (titleLower.includes('fail') || titleLower.includes('error'))) {
    const titles = [
      "Sitter Said Hell No 👎",
      "Hiring Failed LMAO 🚫",
      "They're Too Good Fr 😤",
      "Offer Rejected 💀"
    ];
    const descriptions = [
      "They're too expensive for your broke self lmao",
      "That sitter literally laughed at your offer fr fr",
      "Maybe pay them better next time? Just saying",
      "They saw your pets and dipped, no cap 😭",
      "Not even pet sitters want to work for you bruh"
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
      "Mission Failed LMAO 💥",
      "You Got Fired Fr 🔥",
      "Boss Said Nah 🙅",
      "Work Said Bye 😬"
    ];
    const descriptions = [
      "You're on break... permanently lmao",
      "That was the worst performance ever fr fr 💀",
      "Maybe unemployment is your calling? No cap",
      "Your boss is disappointed (again) ngl",
      "You tried I guess? At least you showed up"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  // General Errors and Failures
  if (titleLower.includes('insufficient') || titleLower.includes('not enough')) {
    const titles = [
      "You're Broke AF 💸",
      "Wallet Empty Fr 🪫",
      "Broke Boy Hours 😭",
      "Too Poor LMAO 💀"
    ];
    const descriptions = [
      "Maybe get a job? Just a thought lmao",
      "Your wallet is literally crying rn fr fr",
      "That's embarrassing ngl 😭",
      "Time to start grinding chief, no cap",
      "Money doesn't grow on trees bruh"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }

  if (titleLower.includes('error') || titleLower.includes('failed')) {
    const titles = [
      "Something Broke LMAO 💥",
      "That Failed Fr 😬",
      "Error Detected Bruh 🚨",
      "Nah That Ain't It 🤷"
    ];
    const descriptions = [
      "Something went wrong but we're not telling you what lmao",
      "The code took a break fr, try again later",
      "It's broken, deal with it chief 💀",
      "Technology said 'absolutely not' rn",
      "Try again or don't, we don't care ngl"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Cooldowns/Waiting
  if (titleLower.includes('cooldown') || titleLower.includes('wait')) {
    const titles = [
      "Slow Down Bruh 🕒",
      "Chill Out Fr ⏰",
      "Touch Grass 🧘",
      "Not So Fast LMAO 🛑"
    ];
    const descriptions = [
      "Bro you're doing way too much rn, take a break fr",
      "The system needs a breather from you lmao",
      "Calm down, you're not that important no cap",
      "Wait your turn like everyone else chief",
      "You're being too thirsty, relax bruh 💀"
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