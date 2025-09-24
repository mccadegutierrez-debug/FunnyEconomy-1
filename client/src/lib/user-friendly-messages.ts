// Utility to transform technical notification messages into user-friendly language

interface FriendlyMessage {
  title: string;
  description?: string;
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
    return {
      title: "Couldn't Save Money 😕",
      description: "Something went wrong while trying to save your coins. Please try again!"
    };
  }
  
  if (titleLower.includes('withdrawal successful')) {
    return {
      title: "Money Retrieved! 💸",
      description: description?.replace(/withdrew/gi, 'took out').replace(/bank/gi, 'savings').replace(/fee/gi, 'small cost') || "You successfully got your money!"
    };
  }
  
  if (titleLower.includes('withdrawal failed')) {
    return {
      title: "Couldn't Get Money 😕",
      description: "Something went wrong while trying to get your coins. Please try again!"
    };
  }
  
  if (titleLower.includes('transfer successful')) {
    return {
      title: "Money Sent! 📤",
      description: description?.replace(/sent/gi, 'gave').replace(/fee/gi, 'small cost') || "Your coins were successfully sent!"
    };
  }
  
  if (titleLower.includes('transfer failed')) {
    return {
      title: "Couldn't Send Money 😕",
      description: "Something went wrong while trying to send coins. Please check the username and try again!"
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
    return {
      title: "Steal Failed 😔",
      description: "Your attempt didn't work this time. Better luck next time!"
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
    return {
      title: "Card Game Loss 😔",
      description: "You didn't win this time, but keep trying! Practice makes perfect!"
    };
  }
  
  if (titleLower.includes('slots win')) {
    return {
      title: "Slot Machine Win! 🎰",
      description: description?.replace(/multiplier/gi, 'bonus') || "The slot machine paid out! You won coins!"
    };
  }
  
  if (titleLower.includes('slots loss')) {
    return {
      title: "Slot Machine Loss 😔",
      description: "The slot machine didn't pay out this time. Try again!"
    };
  }
  
  if (titleLower.includes('coinflip win')) {
    return {
      title: "Coin Toss Win! 🪙",
      description: description || "You guessed correctly! The coin landed your way!"
    };
  }
  
  if (titleLower.includes('coinflip loss')) {
    return {
      title: "Coin Toss Loss 😔",
      description: description || "The coin didn't land your way this time. Try again!"
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
    return {
      title: "Oops, Wrong Answer 😅",
      description: description || "That wasn't quite right. You'll get it next time!"
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
  
  // Errors and Failures
  if (titleLower.includes('error') || titleLower.includes('failed')) {
    return {
      title: "Something Went Wrong 😕",
      description: "There was a problem, but don't worry! Please try again in a moment."
    };
  }
  
  // Cooldowns/Waiting
  if (titleLower.includes('cooldown') || titleLower.includes('wait')) {
    return {
      title: "Please Wait 🕒",
      description: description?.replace(/cooldown/gi, 'waiting time') || "You need to wait a bit before trying again!"
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