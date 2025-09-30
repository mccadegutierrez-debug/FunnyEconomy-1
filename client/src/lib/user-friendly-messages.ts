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
    const titles = [
      "Money Saved! 💰",
      "Deposit Hit Different 🤑",
      "We're So Back 💸",
      "Secured The Bag 💼",
      "W Deposit Fr 🔥",
      "Coins In The Vault 🏦",
      "Aura Points +100 📈",
      "Stacking Chips Rn 🎰"
    ];
    const descriptions = [
      "Your money is safely stored, we're so back 💯",
      "Deposit went through smoother than a mewing streak",
      "The bank said 'let him cook' and took your coins",
      "Money in the bank hits different, aura restored ✨",
      "Your wallet looking absolutely maxxed rn"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('deposit failed')) {
    const titles = [
      "Bank Said Nah Bro 💸",
      "It's So Over 🚫",
      "Deposit Rejected LMAO 😬",
      "Bank Machine Said Nope 🔨",
      "L Deposit 💀",
      "Caught Tweaking At The Bank 📸",
      "Bank Really Said 'Ratio' 🤡",
      "Down Bad With This Deposit 😭",
      "Delulu Energy Detected 🤖",
      "Chat Is This Real? 💩",
      "Skill Issue Activated 🚨",
      "Aura Points -1000 🌽",
      "Deposit Got Ratio'd Hard 🍔",
      "Mid Deposit Energy 😒",
      "Bank Said Absolutely Not ✌️",
      "Caught Lacking By The Bank 🎭"
    ];
    const descriptions = [
      "The bank took one look and said 'it's so over' lmao",
      "Your deposit ghosted harder than your ex",
      "L + ratio + the vault door literally slammed shut",
      "Even the ATM is tweaking rn",
      "That deposit was giving delulu syndrome but flopped 💀",
      "The bank really said 'skill issue' and dipped",
      "Not the deposit getting ratio'd by the system",
      "Bro got caught in 4K trying to deposit negative aura",
      "This deposit screams delulu behavior honestly",
      "That deposit attempt killed your mewing streak 💀",
      "The bank really nuked your aura points",
      "Your deposit has zero rizz, chat is this real?",
      "This some unhinged banking behavior",
      "Deposit fumbled the bag so hard 🎒",
      "The vault saw this deposit and said 'it's giving broke'",
      "Bank really said 'cope harder' and blocked you",
      "You're down catastrophically bad with this one chief",
      "The deposit absolutely cooked your reputation 🍳",
      "Bro this deposit is absolutely cooked",
      "Bank said 'touch grass' and rejected you"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('withdrawal successful')) {
    const titles = [
      "Money Retrieved! 💸",
      "We're So Back 🤑",
      "Secured The Withdraw W 💰",
      "Bank Compliance Achieved ✅",
      "Coins Extracted Successfully 🏦",
      "Cash Out Hit Different 💯",
      "Aura Points Restored 🔥"
    ];
    const descriptions = [
      "You successfully got your money, we're so back",
      "Withdrawal went harder than expected, let him cook",
      "The bank said 'based' and gave you your coins",
      "Your withdrawal is giving main character energy ✨",
      "Money retrieved with maximum sigma grindset"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('withdrawal failed')) {
    const titles = [
      "Withdrawal Denied LMAO 🚨",
      "It's So Over 🙅",
      "Money Machine Broke 💔",
      "Access Denied Bro 🔐",
      "L Withdrawal Detected 💀",
      "Down Bad Withdrawal 😭",
      "Caught Lacking Funds 📉",
      "Vault Said No Diddy ✌️",
      "Withdrawal Got Ratio'd 🤡",
      "Delulu Withdrawal Energy 🤖",
      "Chat Is This Real? 💩",
      "Aura Points Deleted 🌽",
      "Skill Issue At The Bank 🚫",
      "Withdrawal Ate Zero Crumbs 😬",
      "Bank Left You On Read 📱",
      "Withdrawal Fumbled Hard 🎪"
    ];
    const descriptions = [
      "The vault literally laughed and slammed shut lmao",
      "You're broke af, chat is this real? 💀",
      "The bank is holding your coins hostage",
      "Nice try but the money's staying put, it's so over",
      "Bank really hit you with the 'insufficient funds' ratio",
      "This withdrawal is giving delulu energy",
      "The vault said 'absolutely cooked' and blocked you",
      "Bro got caught in 4K with zero balance",
      "Your withdrawal attempt screams tweaking behavior",
      "This some absolutely unhinged withdrawal energy",
      "Bank said 'touch grass' and denied you",
      "You're down astronomically bad with this one chief",
      "The withdrawal absolutely tanked your aura points 💀",
      "Vault really said 'cope and seethe' then locked 🔒",
      "This withdrawal is absolutely cooked, no saving it",
      "Bank living rent free in your empty wallet rn",
      "Not the withdrawal getting ratio'd before it started",
      "Your account balance said 'it's so over'",
      "The ATM really said 'that's an L bozo' 💀",
      "Withdrawal has zero rizz with the bank system"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('transfer successful')) {
    const titles = [
      "Money Sent! 📤",
      "We're So Back 💸",
      "W Transfer 🔥 ✅",
      "Coins Delivered Successfully 🚀",
      "Transfer Slaying 🤑",
      "Aura Transfer Complete 💯"
    ];
    const descriptions = [
      "Your coins were sent successfully, based move",
      "Transfer went through smoother than a mewing streak",
      "Payment delivered with sigma grindset energy",
      "The transfer is giving main character vibes ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('transfer failed')) {
    const titles = [
      "Transfer Rejected LMAO 🚫",
      "It's So Over 👻",
      "Payment Blocked Bro 🛑",
      "Transaction Denied 💀",
      "L Transfer Detected 😭",
      "Down Bad Transfer 🤡",
      "Caught Tweaking 📸",
      "Transfer Got Ratio'd 📉",
      "Delulu Payment Energy 🤖",
      "Chat Is This Real? 💩",
      "Aura Transfer Failed 🌽",
      "Transfer Said No Diddy ✌️",
      "Skill Issue Transaction 🚨",
      "Transfer Fumbled The Bag 🎒",
      "Payment Has Zero Rizz 😬"
    ];
    const descriptions = [
      "That username doesn't exist lmao (unlike your problems)",
      "Your coins got lost in the void, it's so over",
      "The recipient blocked you before you could even send 😭",
      "Skill issue detected, money said bye bye",
      "Transfer really said 'absolutely not' and dipped",
      "Bro got caught in 4K trying to send to a ghost account",
      "This transfer is giving delulu energy honestly",
      "Payment fumbled harder than a broken mewing streak 🏈",
      "The system really hit you with the ratio special",
      "Your transfer has zero aura points 🌟",
      "This some absolutely unhinged payment attempt",
      "Transfer absolutely cooked your reputation",
      "The coins said 'it's giving scam' and bounced",
      "Bro this transfer is absolutely cooked 🍳",
      "Payment really said 'cope' and failed",
      "You're down catastrophically with this transfer chief",
      "The recipient's wallet living rent free without your coins",
      "Not the transfer getting ratio'd into oblivion",
      "Transaction has zero rizz with the system",
      "Bank said 'that's cap' and blocked the whole thing 🧢"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Rob Operations
  if (titleLower.includes('rob successful')) {
    const titles = [
      "Steal Successful! 💰",
      "Rob Went Crazy 🔥",
      "Criminal Arc Activated 😈",
      "Heist Mode: Enabled 🎭",
      "W Rob, Let Him Cook 💯",
      "Stealth 100 Achieved 🥷",
      "Caught Them Lacking 📸"
    ];
    const descriptions = [
      "You successfully took some coins, sigma grindset energy",
      "Bro really pulled off the heist of the century, we're so back",
      "They never saw it coming lmao absolutely cooked them",
      "Rob went harder than expected, aura points restored 🔥",
      "You're giving main villain energy and it's working ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('rob failed')) {
    const titles = [
      "Got Caught LMAO 👮",
      "It's So Over 🚔",
      "Heist Failed So Bad 🤡",
      "Busted 🚨",
      "L Criminal Arc 💀",
      "Down Bad Thief 😭",
      "Caught In 4K Stealing 📸",
      "Rob Attempt Got Ratio'd 🤦",
      "Delulu Robbery Energy 🤖",
      "Chat Is This Real? 💩",
      "Aura Points Obliterated 🌽",
      "Skill Issue Detected 🚫",
      "Criminal Has Zero Rizz 😬",
      "Fumbled The Heist 🎪",
      "Caught Tweaking So Hard 🎭",
      "Robbery Ate Zero Crumbs 😒"
    ];
    const descriptions = [
      "Smooth criminal you are NOT, it's so over 💀",
      "They saw you coming from a mile away, chat is this real?",
      "Maybe crime isn't your calling bro",
      "Get rekt kid, amateur hour is over",
      "You couldn't steal candy from a baby, that's embarrassing",
      "Bro got caught in 4K red-handed like a total bozo",
      "This robbery attempt screams delulu behavior honestly",
      "The police really said 'that's an L' and arrested you",
      "Your criminal arc is giving main character delusion 💀",
      "This some absolutely unhinged crime attempt",
      "You're down astronomically bad as a thief chief",
      "The heist absolutely tanked your aura points",
      "Bro your stealth stat is absolutely cooked 🍳",
      "Police living rent free in your failed robbery plans",
      "Not the robbery getting ratio'd by the cops",
      "Your crime skills have zero rizz",
      "They really said 'cope' and handcuffed you",
      "That robbery killed your mewing streak 💀",
      "Criminal career ate dust and left no crumbs 😭",
      "The victim said 'skill issue' and called the cops"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Game Results
  if (titleLower.includes('blackjack win')) {
    const titles = [
      "Card Game Win! 🎉",
      "Blackjack W Hit Different 🃏",
      "We're So Back 🙏",
      "Dealer Got Ratio'd 💯",
      "Gambling Arc Activated 🎰",
      "Based Blackjack Win 🔥"
    ];
    const descriptions = [
      "You won the card game, absolute legend, let him cook",
      "Blackjack said 'you're valid' and paid out 🤑",
      "Dealer got absolutely demolished, aura points restored",
      "The cards are giving main character energy for you ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('blackjack loss')) {
    const titles = [
      "Blackjack Said Nah LMAO 🃏",
      "It's So Over 💀",
      "Dealer Demolished You 😬",
      "L + Ratio + No Skill 📉",
      "Down Bad At Cards 😭",
      "Caught Lacking At Blackjack 🎭",
      "Chat Is This Real? 💩",
      "Aura Points Deleted 🌽",
      "Delulu Gambling Energy 🤖",
      "Cards Said No Diddy ✌️",
      "Skill Issue At The Table 🚨",
      "Blackjack Fumbled You 🎪",
      "Zero Rizz With Cards 😒",
      "Dealer Living Rent Free 🏠",
      "Cards Ate And Left Nothing 🍽️"
    ];
    const descriptions = [
      "Get absolutely demolished, the house always wins, it's so over",
      "Maybe stick to Uno? Or go fish? Literally anything else lmao",
      "That was painful to watch, chat is this real? 😭",
      "Massive skill issue detected",
      "The cards literally hate you on a personal level bro",
      "Dealer really hit you with the ratio special 💀",
      "Bro got caught in 4K with the worst hand possible",
      "This blackjack attempt screams delulu behavior",
      "Your luck stat is absolutely cooked 🍳",
      "Cards said 'it's giving L energy' and took your money",
      "You're down catastrophically at this table chief",
      "The dealer absolutely nuked your aura points 💀",
      "Blackjack living rent free in your empty balance",
      "Not your hand getting ratio'd by the dealer",
      "Your card skills have zero rizz",
      "Dealer said 'cope harder' and took everything",
      "That game killed your mewing streak 💀",
      "Cards ate your coins and left zero crumbs 😭",
      "The table said 'skill issue' and cleaned you out",
      "Bro's gambling arc ended before it even started 💀"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('slots win')) {
    const titles = [
      "Slot Machine Win! 🎰",
      "We're So Back 🤑",
      "W Spin 💯",
      "Jackpot Energy Achieved ✨",
      "Slots Said Yessir 🔥",
      "Machine Blessed You 🙏"
    ];
    const descriptions = [
      "The slot machine paid out, you're valid, we're so back",
      "Slots hit different when they actually pay 🎊",
      "The machine said 'let him cook' and paid out",
      "Your luck is giving main character vibes rn ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('slots loss')) {
    const titles = [
      "Slots Said Nah LMAO 🎰",
      "It's So Over 💸",
      "Machine Ate Your Coins 😂",
      "Not Even Close 💀",
      "Down Bad At Slots 😭",
      "Caught Lacking By Machine 🎭",
      "Chat Is This Real? 💩",
      "Aura Points Obliterated 🌽",
      "Delulu Gambling Detected 🤖",
      "Slots Got You Good 🤡",
      "Skill Issue At Machine 🚨",
      "Zero Rizz With Spins 😬",
      "Machine Living Rent Free 🏠",
      "Slots Ratio'd Your Wallet 📉",
      "Spin Fumbled The Bag 🎒"
    ];
    const descriptions = [
      "The machine is literally mocking you rn lmao",
      "Your luck ran out faster than your wallet, it's so over",
      "Maybe gambling isn't your thing chief",
      "That was painful to watch, chat is this real? 😭",
      "The slots straight up laughed at your bet bro",
      "Machine really hit you with the ratio treatment 💀",
      "Bro got caught in 4K losing everything",
      "This slot attempt screams delulu behavior honestly",
      "Your spin luck is absolutely cooked 🍳",
      "Slots said 'it's giving broke energy' and took it all",
      "You're down catastrophically with slots chief",
      "The machine absolutely deleted your aura points",
      "Slots living rent free in your empty wallet",
      "Not your spin getting ratio'd by the machine",
      "Your gambling skills have zero rizz",
      "Machine said 'cope and seethe' then ate your coins",
      "That spin killed your mewing streak 💀",
      "Slots ate your money and left zero crumbs 😭",
      "The reels said 'skill issue' and took everything",
      "Bro's slot career ended in one spin 💀"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('coinflip win')) {
    const titles = [
      "Coin Toss Win! 🪙",
      "We're So Back 💯",
      "Coin Blessed You 🙏",
      "50/50 Victory Achieved ✅",
      "Flip Game Strong 🔥"
    ];
    const descriptions = [
      "You guessed correctly, absolute legend, we're so back",
      "Coin said 'you're valid' and landed your way 🪙",
      "The flip gods blessed you, aura points restored",
      "50/50 and you actually won, rare moment ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('coinflip loss')) {
    const titles = [
      "Wrong Side LMAO 🪙",
      "It's So Over 😤",
      "Coin Hates You 💀",
      "50/50 and Still Lost 🤦",
      "Down Bad At Coinflip 😭",
      "Caught Lacking On Flip 🎭",
      "Chat Is This Real? 💩",
      "Aura Points -50 🌽",
      "Delulu Coinflip Energy 🤖",
      "Coin Said No Diddy ✌️",
      "Skill Issue On 50/50 🚨",
      "Zero Rizz With Flips 😬",
      "Coin Living Rent Free 🏠",
      "Flip Ate Zero Crumbs 😒"
    ];
    const descriptions = [
      "It's literally a coin flip and you STILL lost, chat is this real?",
      "The coin said 'absolutely not', it's so over",
      "How do you lose a 50/50? That's actually impressive",
      "Maybe try rock-paper-scissors instead bro",
      "That coin has personal beef with you 💀",
      "Coin really hit you with the ratio on a 50/50 💀",
      "Bro got caught in 4K losing a fair flip",
      "This coinflip attempt screams delulu behavior",
      "Your flip luck is absolutely cooked 🍳",
      "Coin said 'it's giving L energy' and betrayed you",
      "You're down astronomically on a 50/50 chief",
      "The flip absolutely nuked your aura points",
      "Coin living rent free in your losing streak",
      "Not the flip getting ratio'd against you",
      "Your coinflip skills have zero rizz",
      "Coin said 'cope' and landed opposite",
      "That flip killed your mewing streak 💀",
      "Flip ate your bet and left zero crumbs 😭",
      "The coin said 'skill issue' even on 50/50",
      "Bro lost a coin toss, that's actually wild 💀"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Trivia/Quiz
  if (titleLower.includes('correct answer')) {
    const titles = [
      "Right Answer! 🧠",
      "Brain Cells Activated 💡",
      "W Intelligence 🎓",
      "Based Answer 📚",
      "Big Brain Energy ✨",
      "Looksmaxxing IQ 💯"
    ];
    const descriptions = [
      "You got it right, absolute genius, let him cook",
      "Brain really said 'I got you', we're so back",
      "That answer hit different, pure intelligence ✨",
      "Your IQ is giving main character vibes 🧠"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('wrong answer')) {
    const titles = [
      "Big Brain Moment... NOT 🧠",
      "Wrong Answer LMAO 🚫",
      "It's So Over 💀",
      "Intelligence -1000 😬",
      "L Brain Cell Activity 😭",
      "Down Bad IQ Moment 🤡",
      "Caught Tweaking Intelligence 📉",
      "Chat Is This Real? 💩",
      "Aura Points Deleted 🌽",
      "Delulu Response Detected 🤖",
      "Brain Said No Diddy ✌️",
      "Skill Issue On Quiz 🚨",
      "Zero Rizz With Knowledge 😒",
      "Answer Fumbled Hard 🎪",
      "Brain Has Left The Chat 👋"
    ];
    const descriptions = [
      "That answer was wild af, chat is this real? 💀",
      "Did you even read the question lmao",
      "Your brain took a day off, it's so over",
      "Maybe Google it next time? Just a thought",
      "Not your best moment chief, that was embarrassing",
      "Bro really hit submit on that answer 💀",
      "That response got caught in 4K being completely wrong",
      "This answer screams delulu behavior honestly",
      "Your IQ stat is absolutely cooked rn 🍳",
      "Brain cells said 'it's giving stupidity' and bounced",
      "You're down catastrophically in the intelligence department",
      "The answer absolutely tanked your aura points",
      "Common sense living rent free outside your head",
      "Not your answer getting ratio'd by logic",
      "Your quiz skills have zero rizz",
      "Brain said 'cope' and gave the worst answer possible",
      "That answer killed your mewing streak 💀",
      "Knowledge ate dust and left zero crumbs 😭",
      "The quiz said 'skill issue' and marked you wrong",
      "Bro's brain really said 'absolutely not' today 💀"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Daily Rewards
  if (titleLower.includes('daily reward') || titleLower.includes('coin reward')) {
    const titles = [
      "Daily Gift Claimed! 🎁",
      "Freebies Secured 💰",
      "We're So Back 🔥",
      "Free Coins Slaying 🤑",
      "Daily Blessing Received 🙏",
      "Gooning Session Reward 💯"
    ];
    const descriptions = [
      "You got your daily free coins, we're so back",
      "Daily reward hit different, sigma grindset paying off",
      "Free money is always valid, aura points restored 💸",
      "The system blessed you today ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('item reward')) {
    const titles = [
      "Free Item! ✨",
      "Item Drop Secured 🎁",
      "W Loot 💯",
      "Reward Slaying 🔥"
    ];
    const descriptions = [
      "You received a free item, that's valid",
      "Free loot is always a W, we're so back",
      "The item drop blessed you today ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('lootbox reward')) {
    const titles = [
      "Mystery Box! 📦",
      "Lootbox W Secured 🎁",
      "RNG Blessed You 🎰",
      "Box Drop Hit Different 🔥"
    ];
    const descriptions = [
      "You got a mystery box, open it for surprises",
      "Lootbox RNG is on your side, let him cook 🎲",
      "The box gods blessed you today ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Work/Economy Actions
  if (titleLower.includes('work') && (titleLower.includes('success') || titleLower.includes('earn'))) {
    const titles = [
      "Work Complete! 💼",
      "Grind Paid Off 💰",
      "W Work Ethic 🔥",
      "Sigma Grindset Activated 💯",
      "Money Earned Slaying 🤑"
    ];
    const descriptions = [
      "You finished your work and earned coins, sigma grindset",
      "Work hit different when it pays, we're so back",
      "The grind is real and it's paying off, aura points up 💸"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('fish') && titleLower.includes('success')) {
    const titles = [
      "Fishing Success! 🎣",
      "Caught A Big One 🐟",
      "W Fishing Skills 🔥",
      "Fisherman Arc Activated 🌊"
    ];
    const descriptions = [
      "You caught something valuable, fishing W",
      "The fish really said 'take my money', we're so back",
      "Fishing skills are giving main character energy ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('hunt') && titleLower.includes('success')) {
    const titles = [
      "Hunting Success! 🏹",
      "Hunt Went Crazy 🦌",
      "W Hunter Skills 🔥",
      "Predator Mode Enabled 💯"
    ];
    const descriptions = [
      "Your hunt was successful, apex predator energy",
      "Hunt hit different when you actually catch something",
      "The wilderness blessed you today, sigma grindset 🌲"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('dig') && titleLower.includes('success')) {
    const titles = [
      "Digging Success! ⛏️",
      "Found Treasure 💎",
      "W Mining Skills 🔥",
      "Excavation Complete 💯"
    ];
    const descriptions = [
      "You found something valuable while digging, W move",
      "Digging really paid off this time, we're so back",
      "The ground blessed you with treasure ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('crime') && titleLower.includes('success')) {
    const titles = [
      "Mission Complete! 🕵️",
      "Crime Spree Activated 😈",
      "W Criminal Arc 🔥",
      "Heist Successful 💰"
    ];
    const descriptions = [
      "Your mission was successful, villain energy",
      "Crime really does pay sometimes, sigma grindset 💸",
      "The criminal arc is giving main antagonist vibes ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('stream') && titleLower.includes('success')) {
    const titles = [
      "Streaming Success! 📺",
      "Stream Popped Off 🎮",
      "W Content Creator 🔥",
      "Viewers Blessed You 👑"
    ];
    const descriptions = [
      "Your stream went well and you earned coins, content king",
      "Stream hit different when the viewers show up",
      "The algorithm blessed you today, we're so back 📈"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('meme') && titleLower.includes('success')) {
    const titles = [
      "Meme Posted! 😂",
      "Meme Went Viral 🔥",
      "W Meme Game 💯",
      "Based Content Creator ✨"
    ];
    const descriptions = [
      "Your meme was popular and you earned coins, based",
      "Meme really popped off, we're so back 📈",
      "The meme lords blessed you today, let him cook"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Level/Progress
  if (titleLower.includes('level') && (titleLower.includes('up') || titleLower.includes('gain'))) {
    const titles = [
      "Level Up! 🆙",
      "We're So Back 📈",
      "W Progress 🔥",
      "XP Grind Paid Off 💯",
      "Looksmaxxing Progress ✨"
    ];
    const descriptions = [
      "Congratulations! You reached a new level, sigma grindset",
      "Level up hit different, we're so back 🎊",
      "The XP gods blessed you, aura points up",
      "Your progress is giving main character energy ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Pet-specific failures
  if (titleLower.includes('adoption') && titleLower.includes('fail')) {
    const titles = [
      "Pet Ghosted You 👻",
      "It's So Over 🚫",
      "Adoption Rejected LMAO 🐾",
      "Rejected by Pixels 💀",
      "L Pet Owner Energy 😭",
      "Down Bad With Pets 🤡",
      "Caught Tweaking With Pets 🎭",
      "Chat Is This Real? 💩",
      "Aura Points Deleted 🌽",
      "Delulu Pet Parent 🤖",
      "Pet Has Zero Rizz For You 😬",
      "Adoption Fumbled Hard 🎪"
    ];
    const descriptions = [
      "Not even pets want you rn, it's so over lmao",
      "That pet took one look and dipped",
      "Maybe try adopting a rock instead? Just saying",
      "The pet literally swiped left on you 😭",
      "You got rejected by pixels, chat is this real? 💀",
      "Pet really said 'it's giving bad owner vibes' and left",
      "Bro got caught in 4K being rejected by a digital pet",
      "This adoption attempt screams delulu behavior",
      "Your pet parent skills are absolutely cooked 🍳",
      "Pet said 'cope' and chose literally anyone else",
      "You're down catastrophically in the pet department",
      "The adoption absolutely tanked your aura points",
      "Pet living rent free in someone else's home",
      "Not the adoption getting ratio'd by rejection",
      "Your pet owner aura has zero rizz"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('pet') && titleLower.includes('feed')) {
    const titles = [
      "Pet Fed! 🍖",
      "Feeding Success 🐾",
      "W Pet Owner 💯",
      "Pet Care Activated 🔥"
    ];
    const descriptions = [
      "Your pet is now fed and happy, based owner",
      "Pet said 'thank you' with maximum cuteness ✨",
      "Feeding went smoothly, we're so back"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('pet') && titleLower.includes('hungry')) {
    const titles = [
      "Pet Is Starving 🍽️",
      "Feed Your Pet ASAP 🐾",
      "Hunger Alert! 🚨",
      "Pet Needs Food 💀"
    ];
    const descriptions = [
      "Your pet is getting hangry, feed them before it's too late",
      "The pet is giving 'I'm about to ghost you' energy 😭",
      "Feed the poor thing, what are you doing? 💀"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('pet') && titleLower.includes('died')) {
    const titles = [
      "Pet Died 💀",
      "It's So Over 😭",
      "You Monster 🪦",
      "L Pet Owner 💔",
      "Down Catastrophically Bad 😢"
    ];
    const descriptions = [
      "Your pet died from neglect, you absolute monster, it's so over",
      "RIP to your pet, maybe try harder next time? 💀",
      "The pet said 'goodbye cruel world' and dipped",
      "You really let your pet die, chat is this real? 😭"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('pet') && titleLower.includes('level')) {
    const titles = [
      "Pet Leveled Up! 🆙",
      "Pet Growth Complete 🐾",
      "W Pet Training 💯",
      "Pet Looksmaxxing ✨"
    ];
    const descriptions = [
      "Your pet gained a level, sigma pet owner grindset",
      "Pet said 'I'm getting stronger', we're so back 🔥",
      "Training paying off, your pet is evolving ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Inventory/Items
  if (titleLower.includes('item added') || titleLower.includes('item received')) {
    const titles = [
      "Item Acquired! ✨",
      "Loot Secured 🎁",
      "W Item Get 💯",
      "Inventory Update 🔥"
    ];
    const descriptions = [
      "New item added to your inventory, we're so back",
      "Item secured successfully, sigma grindset ✨",
      "Your collection is growing nicely"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('item sold')) {
    const titles = [
      "Item Sold! 💰",
      "Sale Complete ✅",
      "W Merchant Skills 🔥",
      "Coins Secured 🤑"
    ];
    const descriptions = [
      "You successfully sold the item, we're so back 💸",
      "Sale went through smoothly, sigma grindset",
      "Money acquired, your trading skills are elite ✨"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('inventory full')) {
    const titles = [
      "Inventory Full! 🎒",
      "No Space Left 💀",
      "Clean Your Inventory 🧹",
      "Hoarding Problem Detected 😭"
    ];
    const descriptions = [
      "Your inventory is completely full, clean it out bro",
      "You're hoarding like crazy, sell some stuff",
      "No more space available, it's so over until you clean up"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Errors/Failures
  if (titleLower.includes('insufficient') || titleLower.includes('not enough')) {
    const titles = [
      "Broke AF 💸",
      "It's So Over 💀",
      "Not Enough Coins 😭",
      "Wallet Empty LMAO 🤡",
      "Down Bad Financially 📉"
    ];
    const descriptions = [
      "You don't have enough money for that, chat is this real? 💀",
      "Your wallet is crying rn, go earn some coins",
      "Insufficient funds detected, sigma grindset needed 💸",
      "You're broke, it's so over until you grind"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  // Cooldowns/Waiting
  if (titleLower.includes('cooldown') || titleLower.includes('wait')) {
    const titles = [
      "Slow Down Bro 🕒",
      "Chill Out ⏰",
      "Touch Grass 🧘",
      "Not So Fast LMAO 🛑",
      "L Patience 💀",
      "Down Bad Spamming 😭",
      "Caught Tweaking 🎭",
      "Chat Is This Real? 💩",
      "Aura Points -100 🌽",
      "Delulu Spam Behavior 🤖",
      "Zero Rizz With Timing 😬",
      "Patience Fumbled 🎪"
    ];
    const descriptions = [
      "Bro you're doing way too much rn, take a break",
      "The system needs a breather from you lmao",
      "Calm down, you're not that important, it's so over for now",
      "Wait your turn like everyone else chief",
      "You're being too thirsty, relax bro 💀",
      "System really said 'touch grass' and timed you out",
      "Bro got caught in 4K spamming like crazy",
      "This spam attempt screams delulu behavior",
      "Your patience stat is absolutely cooked 🍳",
      "Cooldown said 'it's giving desperate' and blocked you",
      "You're down catastrophically with the spam chief",
      "The timer absolutely nuked your aura points 💀",
      "Patience living rent free... but not in your brain",
      "Not you getting ratio'd by the cooldown system"
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
      description: description || "Great to see you again, we're so back!"
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
      description: description?.replace(/bought/gi, 'purchased') || "You successfully bought the item, we're so back!"
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
