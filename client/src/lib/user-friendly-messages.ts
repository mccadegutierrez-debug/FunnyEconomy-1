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
      "Bank Account Bussin Fr 💸",
      "Secured The Bag 💼",
      "W Deposit No Cap 🔥",
      "Coins In The Vault 🏦",
      "Money Moves Only 📈",
      "Stacking Chips Rn 🎰"
    ];
    const descriptions = [
      "Your money is safely stored, no cap 💯",
      "Deposit went through smoother than butter fr",
      "The bank said 'yessir' and took your coins",
      "Money in the bank hits different ngl",
      "Your wallet looking kinda thick rn fr fr"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('deposit failed')) {
    const titles = [
      "Bank Said Nah Bro 💸",
      "Deposit Rejected LMAO 🚫",
      "Your Money Dipped 😬",
      "Bank Machine Said Nope 🔨",
      "L Deposit Fr Fr 💀",
      "Caught In 4K Lacking 📸",
      "Bank Really Said 'Ratio' 🤡",
      "Down Bad With This Deposit 😭",
      "NPC Energy Detected 🤖",
      "Goofy Ahh Deposit 💩",
      "Skill Issue Activated 🚨",
      "Ohio Banking Moment 🌽",
      "Deposit Got Fanum Taxed 🍔",
      "Mid Deposit Energy 😒",
      "Deposit Said Sybau ✌️",
      "Caught Lacking By The Bank 🎭"
    ];
    const descriptions = [
      "The bank took one look and said 'absolutely not' lmao",
      "Your deposit ghosted harder than your ex, fr fr",
      "L + ratio + the vault door literally slammed in your face",
      "Even the ATM is laughing at you rn, no cap",
      "That deposit was giving main character syndrome but flopped 💀",
      "The bank really said 'skill issue' and dipped",
      "Not the deposit getting ratio'd by the system fr",
      "Bro got caught in 4K trying to deposit negative energy",
      "This deposit screams NPC behavior honestly",
      "That deposit attempt was straight outta Ohio 💀",
      "The bank really hit you with the Fanum tax",
      "Your deposit has zero rizz ngl",
      "This some goofy ahh banking fr fr",
      "Deposit fumbled the bag so hard 🎒",
      "The vault saw this deposit and said 'it's giving broke'",
      "Bank really said 'cope harder' and blocked you",
      "You're down catastrophically bad with this one chief",
      "The deposit pulled a Grimace Shake and vanished 💜",
      "Bro this deposit is absolutely cooked 🍳",
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
      "Withdrawal Bussin Fr 🤑",
      "Secured The Withdraw W 💰",
      "Bank Compliance Achieved ✅",
      "Coins Extracted Successfully 🏦",
      "Cash Out Hit Different 💯",
      "W Withdrawal No Cap 🔥"
    ];
    const descriptions = [
      "You successfully got your money, W move fr",
      "Withdrawal went harder than expected ngl",
      "The bank said 'valid' and gave you your coins",
      "Your withdrawal is giving main character energy ✨",
      "Money retrieved with maximum efficiency no cap"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('withdrawal failed')) {
    const titles = [
      "Withdrawal Denied LMAO 🚨",
      "Bank Said Hell No 🙅",
      "Money Machine Broke Fr 💔",
      "Access Denied Bro 🔐",
      "L Withdrawal Detected 💀",
      "Down Bad Withdrawal 😭",
      "Caught Lacking Funds 📉",
      "Vault Said Sybau ✌️",
      "Withdrawal Got Ratio'd 🤡",
      "NPC Withdrawal Energy 🤖",
      "Goofy Ahh Withdraw Attempt 💩",
      "Ohio Withdrawal Moment 🌽",
      "Skill Issue At The Bank 🚫",
      "Withdrawal Ate Zero Crumbs 😬",
      "Bank Left You On Read Fr 📱",
      "Withdrawal Fumbled Hard 🎪"
    ];
    const descriptions = [
      "The vault literally laughed and slammed shut lmao",
      "You're broke af, what did you expect? 💀",
      "The bank is holding your coins hostage fr fr",
      "Nice try but the money's staying put, no cap",
      "Bank really hit you with the 'insufficient funds' ratio",
      "This withdrawal is giving broke boy summer vibes",
      "The vault said 'it's giving poverty' and blocked you",
      "Bro got caught in 4K with zero balance",
      "Your withdrawal attempt screams NPC behavior",
      "This some Ohio-level withdrawal energy fr",
      "Bank said 'touch grass' and denied you",
      "You're down astronomically bad with this one chief",
      "The withdrawal pulled a Grimace Shake and disappeared 💜",
      "Vault really said 'cope and seethe' then locked 🔒",
      "This withdrawal is absolutely cooked, no saving it",
      "Bank living rent free in your empty wallet rn",
      "Not the withdrawal getting fanum taxed before it started 🍔",
      "Your account balance said 'absolutely not' fr fr",
      "The ATM really said 'that's an L bozo' 💀",
      "Withdrawal has zero rizz with the bank system ngl"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('transfer successful')) {
    const titles = [
      "Money Sent! 📤",
      "Transfer Hit Different 💸",
      "W Transfer No Cap ✅",
      "Coins Delivered Successfully 🚀",
      "Transfer Bussin Fr 🤑",
      "Payment Slaying Rn 💯"
    ];
    const descriptions = [
      "Your coins were sent successfully, W move",
      "Transfer went through smoother than ice fr",
      "Payment delivered with sigma energy no cap",
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
      "Money Vanished Fr 👻",
      "Payment Blocked Bro 🛑",
      "Transaction Denied 💀",
      "L Transfer Detected 😭",
      "Down Bad Transfer 🤡",
      "Caught In 4K Lacking 📸",
      "Transfer Got Ratio'd 📉",
      "NPC Payment Energy 🤖",
      "Goofy Ahh Transaction 💩",
      "Ohio Transfer Moment 🌽",
      "Transfer Said Sybau ✌️",
      "Skill Issue Transaction 🚨",
      "Transfer Fumbled The Bag 🎒",
      "Payment Has Zero Rizz 😬"
    ];
    const descriptions = [
      "That username doesn't exist lmao (unlike your problems)",
      "Your coins got lost in the void fr fr",
      "The recipient blocked you before you could even send 😭",
      "Skill issue detected, money said bye bye",
      "Transfer really said 'absolutely not' and dipped",
      "Bro got caught in 4K trying to send to a ghost account",
      "This transfer is giving NPC energy honestly",
      "Payment fumbled harder than a slippery football 🏈",
      "The system really hit you with the ratio special",
      "Your transfer has zero aura ngl 🌟",
      "This some goofy ahh payment attempt fr fr",
      "Transfer pulled a Grimace Shake and vanished 💜",
      "The coins said 'it's giving scam' and bounced",
      "Bro this transfer is absolutely cooked 🍳",
      "Payment really said 'cope' and failed",
      "You're down catastrophically with this transfer chief",
      "The recipient's wallet living rent free without your coins",
      "Not the transfer getting fanum taxed into oblivion 🍔",
      "Transaction has zero w rizz with the system",
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
      "Rob Went Crazy Fr 🔥",
      "Criminal Arc Activated 😈",
      "Heist Mode: Enabled 🎭",
      "W Rob No Cap 💯",
      "Stealth 100 Achieved 🥷",
      "Caught Them Lacking 📸"
    ];
    const descriptions = [
      "You successfully took some coins, sigma energy fr",
      "Bro really pulled off the heist of the century",
      "They never saw it coming lmao absolutely cooked them",
      "Rob went harder than expected no cap 🔥",
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
      "Heist Failed So Bad 🚔",
      "You're Trash at This 🤡",
      "Busted Fr Fr 🚨",
      "L Criminal Arc 💀",
      "Down Bad Thief 😭",
      "Caught In 4K Stealing 📸",
      "Rob Attempt Got Ratio'd 🤦",
      "NPC Robbery Energy 🤖",
      "Goofy Ahh Heist 💩",
      "Ohio Robbery Moment 🌽",
      "Skill Issue Detected 🚫",
      "Criminal Has Zero Rizz 😬",
      "Fumbled The Heist 🎪",
      "Caught Lacking So Hard 🎭",
      "Robbery Ate Zero Crumbs 😒"
    ];
    const descriptions = [
      "Smooth criminal you are NOT, no cap 💀",
      "They saw you coming from a mile away lmao",
      "Maybe crime isn't your calling bro",
      "Get rekt kid, amateur hour is over fr",
      "You couldn't steal candy from a baby, that's embarrassing",
      "Bro got caught in 4K red-handed like a total bozo",
      "This robbery attempt screams NPC behavior honestly",
      "The police really said 'that's an L' and arrested you",
      "Your criminal arc is giving main character delusion 💀",
      "This some goofy ahh crime attempt fr fr",
      "You're down astronomically bad as a thief chief",
      "The heist pulled a Grimace Shake and flopped 💜",
      "Bro your stealth stat is absolutely cooked 🍳",
      "Police living rent free in your failed robbery plans",
      "Not the robbery getting fanum taxed by the cops 🍔",
      "Your crime skills have zero w rizz ngl",
      "They really said 'cope' and handcuffed you",
      "That robbery was straight outta Ohio, total fail 🌽",
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
      "Cards Blessed You Fr 🙏",
      "Dealer Got Ratio'd 💯",
      "Gambling Arc Activated 🎰",
      "W Blackjack No Cap 🔥"
    ];
    const descriptions = [
      "You won the card game, absolute legend fr",
      "Blackjack said 'you're valid' and paid out 🤑",
      "Dealer got absolutely demolished, no cap",
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
      "Dealer Demolished You Fr 💀",
      "Cards Hate You Bro 😬",
      "L + Ratio + No Skill 📉",
      "Down Bad At Cards 😭",
      "Caught Lacking At Blackjack 🎭",
      "Goofy Ahh Card Game 💩",
      "Ohio Blackjack Moment 🌽",
      "NPC Gambling Energy 🤖",
      "Cards Said Sybau ✌️",
      "Skill Issue At The Table 🚨",
      "Blackjack Fumbled You 🎪",
      "Zero Rizz With Cards 😒",
      "Dealer Living Rent Free 🏠",
      "Cards Ate And Left Nothing 🍽️"
    ];
    const descriptions = [
      "Get absolutely demolished, the house always wins no cap",
      "Maybe stick to Uno? Or go fish? Literally anything else lmao",
      "That was painful to watch fr fr 😭",
      "Massive skill issue detected",
      "The cards literally hate you on a personal level bro",
      "Dealer really hit you with the ratio special 💀",
      "Bro got caught in 4K with the worst hand possible",
      "This blackjack attempt screams NPC behavior",
      "Your luck stat is absolutely cooked fr fr 🍳",
      "Cards said 'it's giving L energy' and took your money",
      "You're down catastrophically at this table chief",
      "The dealer pulled a Grimace Shake on your wallet 💜",
      "Blackjack living rent free in your empty balance",
      "Not your hand getting fanum taxed by the dealer 🍔",
      "Your card skills have zero w rizz ngl",
      "Dealer said 'cope harder' and took everything",
      "That game was straight outta Ohio, total disaster 🌽",
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
      "Slots Bussin Fr 🤑",
      "W Spin No Cap 💯",
      "Jackpot Energy Achieved ✨",
      "Slots Said Yessir 🔥",
      "Machine Blessed You 🙏"
    ];
    const descriptions = [
      "The slot machine paid out, you're valid fr",
      "Slots hit different when they actually pay 🎊",
      "The machine said 'you deserve this' no cap",
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
      "Machine Ate Your Coins Fr 💸",
      "Massive L Bro 😂",
      "Not Even Close 💀",
      "Down Bad At Slots 😭",
      "Caught Lacking By Machine 🎭",
      "Goofy Ahh Spin 💩",
      "Ohio Slots Moment 🌽",
      "NPC Gambling Detected 🤖",
      "Slots Got You Good 🤡",
      "Skill Issue At Machine 🚨",
      "Zero Rizz With Spins 😬",
      "Machine Living Rent Free 🏠",
      "Slots Ratio'd Your Wallet 📉",
      "Spin Fumbled The Bag 🎒"
    ];
    const descriptions = [
      "The machine is literally mocking you rn lmao",
      "Your luck ran out faster than your wallet fr fr",
      "Maybe gambling isn't your thing chief, no cap",
      "That was painful to watch ngl 😭",
      "The slots straight up laughed at your bet bro",
      "Machine really hit you with the ratio treatment 💀",
      "Bro got caught in 4K losing everything",
      "This slot attempt screams NPC behavior honestly",
      "Your spin luck is absolutely cooked fr fr 🍳",
      "Slots said 'it's giving broke energy' and took it all",
      "You're down catastrophically with slots chief",
      "The machine pulled a Grimace Shake on you 💜",
      "Slots living rent free in your empty wallet",
      "Not your spin getting fanum taxed by the machine 🍔",
      "Your gambling skills have zero w rizz ngl",
      "Machine said 'cope and seethe' then ate your coins",
      "That spin was straight outta Ohio, pure loss 🌽",
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
      "Coinflip W Hit Different 💯",
      "Coin Blessed You Fr 🙏",
      "50/50 Victory Achieved ✅",
      "Flip Game Strong 🔥"
    ];
    const descriptions = [
      "You guessed correctly, absolute legend fr",
      "Coin said 'you're valid' and landed your way 🪙",
      "The flip gods blessed you no cap",
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
      "Coin Hates You Fr 😤",
      "50/50 and Still Lost 💀",
      "Flipped and Flopped Bro 🤦",
      "Down Bad At Coinflip 😭",
      "Caught Lacking On Flip 🎭",
      "Goofy Ahh Coin Toss 💩",
      "Ohio Flip Moment 🌽",
      "NPC Coinflip Energy 🤖",
      "Coin Said Sybau ✌️",
      "Skill Issue On 50/50 🚨",
      "Zero Rizz With Flips 😬",
      "Coin Living Rent Free 🏠",
      "Flip Ate Zero Crumbs 😒"
    ];
    const descriptions = [
      "It's literally a coin flip and you STILL lost lmao",
      "The coin said 'absolutely not' fr fr",
      "How do you lose a 50/50? That's actually impressive ngl",
      "Maybe try rock-paper-scissors instead bro",
      "That coin has personal beef with you, no cap 💀",
      "Coin really hit you with the ratio on a 50/50 💀",
      "Bro got caught in 4K losing a fair flip",
      "This coinflip attempt screams NPC behavior",
      "Your flip luck is absolutely cooked fr fr 🍳",
      "Coin said 'it's giving L energy' and betrayed you",
      "You're down astronomically on a 50/50 chief",
      "The flip pulled a Grimace Shake and failed you 💜",
      "Coin living rent free in your losing streak",
      "Not the flip getting fanum taxed against you 🍔",
      "Your coinflip skills have zero w rizz ngl",
      "Coin said 'cope' and landed opposite",
      "That flip was straight outta Ohio, pure loss 🌽",
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
      "W Intelligence No Cap 🎓",
      "Smart Move Fr 📚",
      "Big Brain Energy ✨",
      "Knowledge Is Power 💯"
    ];
    const descriptions = [
      "You got it right, absolute genius fr",
      "Brain really said 'I got you' no cap",
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
      "Intelligence -1000 💀",
      "Not Even Close Bro 😬",
      "L Brain Cell Activity 😭",
      "Down Bad IQ Moment 🤡",
      "Caught Lacking Intelligence 📉",
      "Goofy Ahh Answer 💩",
      "Ohio Answer Energy 🌽",
      "NPC Response Detected 🤖",
      "Brain Said Sybau ✌️",
      "Skill Issue On Quiz 🚨",
      "Zero Rizz With Knowledge 😒",
      "Answer Fumbled Hard 🎪",
      "Brain Has Left The Chat 👋"
    ];
    const descriptions = [
      "That answer was wild af, no cap 💀",
      "Did you even read the question lmao",
      "Your brain took a day off fr fr",
      "Maybe Google it next time? Just a thought",
      "Not your best moment chief, that was embarrassing",
      "Bro really hit submit on that answer 💀",
      "That response got caught in 4K being completely wrong",
      "This answer screams NPC behavior honestly",
      "Your IQ stat is absolutely cooked rn 🍳",
      "Brain cells said 'it's giving stupidity' and bounced",
      "You're down catastrophically in the intelligence department",
      "The answer pulled a Grimace Shake and disappeared 💜",
      "Common sense living rent free outside your head",
      "Not your answer getting fanum taxed by logic 🍔",
      "Your quiz skills have zero w rizz ngl",
      "Brain said 'cope' and gave the worst answer possible",
      "That answer was straight outta Ohio, pure nonsense 🌽",
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
      "Freebies Secured Fr 💰",
      "W Daily Reward 🔥",
      "Free Coins Bussin 🤑",
      "Daily Blessing Received 🙏",
      "Reward Game Strong 💯"
    ];
    const descriptions = [
      "You got your daily free coins, W move",
      "Daily reward hit different fr fr",
      "Free money is always valid no cap 💸",
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
      "W Loot No Cap 💯",
      "Reward Bussin Fr 🔥"
    ];
    const descriptions = [
      "You received a free item, that's valid",
      "Free loot is always a W fr fr",
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
      "RNG Blessed You Fr 🎰",
      "Box Drop Hit Different 🔥"
    ];
    const descriptions = [
      "You got a mystery box, open it for surprises",
      "Lootbox RNG is on your side no cap 🎲",
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
      "Grind Paid Off Fr 💰",
      "W Work Ethic 🔥",
      "Hustle Mode Activated 💯",
      "Money Earned Bussin 🤑"
    ];
    const descriptions = [
      "You finished your work and earned coins, sigma grindset",
      "Work hit different when it pays fr fr",
      "The grind is real and it's paying off no cap 💸"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('fish') && titleLower.includes('success')) {
    const titles = [
      "Fishing Success! 🎣",
      "Caught A Big One Fr 🐟",
      "W Fishing Skills 🔥",
      "Fisherman Arc Activated 🌊"
    ];
    const descriptions = [
      "You caught something valuable, fishing W",
      "The fish really said 'take my money' lmao",
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
      "Hunt Went Crazy Fr 🦌",
      "W Hunter Skills 🔥",
      "Predator Mode Enabled 💯"
    ];
    const descriptions = [
      "Your hunt was successful, apex predator energy",
      "Hunt hit different when you actually catch something fr",
      "The wilderness blessed you today no cap 🌲"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('dig') && titleLower.includes('success')) {
    const titles = [
      "Digging Success! ⛏️",
      "Found Treasure Fr 💎",
      "W Mining Skills 🔥",
      "Excavation Complete 💯"
    ];
    const descriptions = [
      "You found something valuable while digging, W move",
      "Digging really paid off this time no cap",
      "The ground blessed you with treasure fr fr ✨"
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
      "Heist Successful Fr 💰"
    ];
    const descriptions = [
      "Your mission was successful, villain energy",
      "Crime really does pay sometimes fr fr 💸",
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
      "Stream Popped Off Fr 🎮",
      "W Content Creator 🔥",
      "Viewers Blessed You 👑"
    ];
    const descriptions = [
      "Your stream went well and you earned coins, content king",
      "Stream hit different when the viewers show up fr",
      "The algorithm blessed you today no cap 📈"
    ];
    return {
      title: pickRandom(titles),
      description: pickRandom(descriptions)
    };
  }
  
  if (titleLower.includes('meme') && titleLower.includes('success')) {
    const titles = [
      "Meme Posted! 😂",
      "Meme Went Viral Fr 🔥",
      "W Meme Game 💯",
      "Content Creator Energy ✨"
    ];
    const descriptions = [
      "Your meme was popular and you earned coins, based",
      "Meme really popped off no cap 📈",
      "The meme lords blessed you today fr fr"
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
      "Leveling Bussin Fr 📈",
      "W Progress No Cap 🔥",
      "XP Grind Paid Off 💯",
      "Main Character Moment ✨"
    ];
    const descriptions = [
      "Congratulations! You reached a new level, W grind",
      "Level up hit different fr fr 🎊",
      "The XP gods blessed you no cap",
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
      "Pet Ghosted You Fr 👻",
      "Adoption Rejected LMAO 🚫",
      "Pet Said Nah Bro 🐾",
      "Rejected by Pixels 💀",
      "L Pet Owner Energy 😭",
      "Down Bad With Pets 🤡",
      "Caught Lacking By Pet 🎭",
      "Goofy Ahh Adoption 💩",
      "Ohio Pet Moment 🌽",
      "NPC Pet Parent 🤖",
      "Pet Has Zero Rizz For You 😬",
      "Adoption Fumbled Hard 🎪"
    ];
    const descriptions = [
      "Not even pets want you rn lmao",
      "That pet took one look and dipped fr fr",
      "Maybe try adopting a rock instead? No cap",
      "The pet literally swiped left on you 😭",
      "You got rejected by pixels, that's wild bro",
      "Pet really said 'it's giving bad owner vibes' and left 💀",
      "Bro got caught in 4K being rejected by a digital pet",
      "This adoption attempt screams NPC behavior",
      "Your pet parent skills are absolutely cooked 🍳",
      "Pet said 'cope' and chose literally anyone else",
      "You're down catastrophically in the pet department",
      "The adoption pulled a Grimace Shake and failed 💜",
      "Pet living rent free in someone else's home",
      "Not the adoption getting fanum taxed by rejection 🍔",
      "Your pet owner aura has zero w rizz ngl"
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
      "Not Happening Bro 🛑",
      "L Room Energy 💀",
      "Down Bad Room Setup 😭",
      "Caught Lacking Design Skills 🎨",
      "Goofy Ahh Room 💩",
      "Ohio Room Moment 🌽",
      "NPC Interior Designer 🤖"
    ];
    const descriptions = [
      "That room name is straight up trash, pick another lmao",
      "Room rejected faster than your last relationship fr fr 💀",
      "The room builder literally quit on you",
      "Nice try but that ain't gonna work, no cap",
      "Room really said 'it's giving bad taste' and dipped",
      "Bro got caught in 4K with terrible room ideas",
      "This room creation screams NPC behavior",
      "Your interior design skills are absolutely cooked 🍳"
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
      "Offer Rejected 💀",
      "L Employer Energy 😭",
      "Down Bad Hiring 🤡",
      "Sitter Ghosted You 👻",
      "Goofy Ahh Job Offer 💩"
    ];
    const descriptions = [
      "They're too expensive for your broke self lmao",
      "That sitter literally laughed at your offer fr fr",
      "Maybe pay them better next time? Just saying",
      "They saw your pets and dipped, no cap 😭",
      "Not even pet sitters want to work for you bro",
      "Sitter really said 'that's not enough' and left 💀",
      "Your job offer has zero rizz with professionals ngl"
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
      "Work Said Bye 😬",
      "L Work Performance 💀",
      "Down Bad At Job 😭",
      "Caught Lacking Skills 📉",
      "Goofy Ahh Work Ethic 💩",
      "Ohio Job Moment 🌽",
      "NPC Employee Energy 🤖",
      "Work Has Zero Rizz 😒",
      "Career Fumbled Hard 🎪"
    ];
    const descriptions = [
      "You're on break... permanently lmao",
      "That was the worst performance ever fr fr 💀",
      "Maybe unemployment is your calling? No cap",
      "Your boss is disappointed (again) ngl",
      "You tried I guess? At least you showed up",
      "Work really said 'you're fired' and meant it 🔥",
      "Bro got caught in 4K being terrible at the job",
      "This work attempt screams NPC behavior",
      "Your job skills are absolutely cooked fr fr 🍳",
      "Boss said 'it's giving incompetence' and let you go",
      "You're down catastrophically in your career chief"
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
      "Too Poor LMAO 💀",
      "L Financial Status 🤡",
      "Down Bad Financially 📉",
      "Caught Lacking Funds 💔",
      "Goofy Ahh Bank Balance 💩",
      "Ohio Wealth Level 🌽",
      "NPC Money Management 🤖",
      "Zero Rizz With Money 😬",
      "Wallet Fumbled The Bag 🎒"
    ];
    const descriptions = [
      "Maybe get a job? Just a thought lmao",
      "Your wallet is literally crying rn fr fr",
      "That's embarrassing ngl 😭",
      "Time to start grinding chief, no cap",
      "Money doesn't grow on trees bro",
      "Wallet really said 'absolutely nothing in here' 💀",
      "Bro got caught in 4K being completely broke",
      "This financial situation screams NPC behavior",
      "Your money management is absolutely cooked 🍳",
      "Bank account said 'it's giving poverty' fr fr",
      "You're down astronomically in the wealth department",
      "Funds pulled a Grimace Shake and vanished 💜",
      "Money living rent free... nowhere because you have none",
      "Not your balance getting fanum taxed to zero 🍔"
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
      "Error Detected Bro 🚨",
      "Nah That Ain't It 🤷",
      "L System Moment 💀",
      "Down Bad Technology 😭",
      "Caught In 4K Glitching 🎭",
      "Goofy Ahh Error 💩",
      "Ohio Tech Moment 🌽",
      "NPC System Behavior 🤖",
      "Code Has Zero Rizz 😬",
      "System Fumbled Hard 🎪"
    ];
    const descriptions = [
      "Something went wrong but we're not telling you what lmao",
      "The code took a break fr, try again later",
      "It's broken, deal with it chief 💀",
      "Technology said 'absolutely not' rn",
      "Try again or don't, we don't care ngl",
      "System really hit you with the 'error 404: skill not found'",
      "Bro got caught in 4K by a system failure",
      "This error screams NPC coding behavior",
      "The system is absolutely cooked right now 🍳",
      "Code said 'it's giving broken' and crashed"
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
      "Chill Out Fr ⏰",
      "Touch Grass 🧘",
      "Not So Fast LMAO 🛑",
      "L Patience 💀",
      "Down Bad Spamming 😭",
      "Caught Lacking Chill 🎭",
      "Goofy Ahh Speed 💩",
      "Ohio Pace Energy 🌽",
      "NPC Spam Behavior 🤖",
      "Zero Rizz With Timing 😬",
      "Patience Fumbled 🎪"
    ];
    const descriptions = [
      "Bro you're doing way too much rn, take a break fr",
      "The system needs a breather from you lmao",
      "Calm down, you're not that important no cap",
      "Wait your turn like everyone else chief",
      "You're being too thirsty, relax bro 💀",
      "System really said 'touch grass' and timed you out",
      "Bro got caught in 4K spamming like crazy",
      "This spam attempt screams NPC behavior",
      "Your patience stat is absolutely cooked 🍳",
      "Cooldown said 'it's giving desperate' and blocked you",
      "You're down catastrophically with the spam chief",
      "The timer pulled a Grimace Shake on your impatience 💜",
      "Patience living rent free... but not in your brain",
      "Not you getting fanum taxed by the cooldown system 🍔"
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
