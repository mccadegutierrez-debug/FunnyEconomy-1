import { storage } from "../storage";

export class EconomyService {
  // 100+ Work job options
  private static readonly WORK_OPTIONS = [
    { id: "meme-farmer", name: "Meme Farmer", min: 100, max: 300, xp: 5 },
    { id: "doge-miner", name: "Doge Miner", min: 50, max: 500, xp: 8 },
    { id: "pepe-trader", name: "Pepe Trader", min: 150, max: 400, xp: 6 },
    { id: "nft-creator", name: "NFT Creator", min: 200, max: 600, xp: 10 },
    { id: "mod-botter", name: "Mod Botter", min: 80, max: 350, xp: 7 },
    { id: "tiktok-dancer", name: "TikTok Dancer", min: 120, max: 380, xp: 6 },
    { id: "discord-mod", name: "Discord Mod", min: 90, max: 320, xp: 5 },
    { id: "reddit-karma-farmer", name: "Reddit Karma Farmer", min: 110, max: 340, xp: 6 },
    { id: "twitch-streamer", name: "Twitch Streamer", min: 180, max: 520, xp: 9 },
    { id: "youtube-clickbaiter", name: "YouTube Clickbaiter", min: 160, max: 480, xp: 8 },
    { id: "instagram-influencer", name: "Instagram Influencer", min: 190, max: 550, xp: 10 },
    { id: "twitter-shitposter", name: "Twitter Shitposter", min: 140, max: 420, xp: 7 },
    { id: "gif-maker", name: "GIF Maker", min: 100, max: 310, xp: 5 },
    { id: "emoji-designer", name: "Emoji Designer", min: 130, max: 390, xp: 7 },
    { id: "filter-creator", name: "Filter Creator", min: 150, max: 430, xp: 8 },
    { id: "vtuber", name: "VTuber", min: 210, max: 590, xp: 11 },
    { id: "podcast-host", name: "Podcast Host", min: 170, max: 490, xp: 9 },
    { id: "onlyfans-chef", name: "OnlyFans Chef", min: 220, max: 610, xp: 11 },
    { id: "genshin-player", name: "Professional Genshin Player", min: 95, max: 330, xp: 6 },
    { id: "minecraft-builder", name: "Minecraft Builder", min: 105, max: 345, xp: 6 },
    { id: "fortnite-coach", name: "Fortnite Coach", min: 185, max: 535, xp: 9 },
    { id: "valorant-smurf", name: "Valorant Smurf", min: 125, max: 370, xp: 7 },
    { id: "league-flamer", name: "League Flamer", min: 85, max: 305, xp: 5 },
    { id: "csgo-skin-trader", name: "CS:GO Skin Trader", min: 195, max: 560, xp: 10 },
    { id: "roblox-developer", name: "Roblox Developer", min: 135, max: 400, xp: 7 },
    { id: "among-us-detective", name: "Among Us Detective", min: 115, max: 355, xp: 6 },
    { id: "fall-guys-pro", name: "Fall Guys Pro", min: 145, max: 425, xp: 8 },
    { id: "crab-game-player", name: "Crab Game Player", min: 100, max: 315, xp: 5 },
    { id: "beta-tester", name: "Professional Beta Tester", min: 155, max: 445, xp: 8 },
    { id: "bug-reporter", name: "Bug Reporter", min: 110, max: 335, xp: 6 },
    { id: "game-reviewer", name: "Game Reviewer", min: 175, max: 505, xp: 9 },
    { id: "speedrunner", name: "Speedrunner", min: 205, max: 575, xp: 10 },
    { id: "achievement-hunter", name: "Achievement Hunter", min: 120, max: 365, xp: 7 },
    { id: "wiki-editor", name: "Wiki Editor", min: 90, max: 295, xp: 5 },
    { id: "subreddit-mod", name: "Subreddit Moderator", min: 130, max: 385, xp: 7 },
    { id: "meme-historian", name: "Meme Historian", min: 140, max: 410, xp: 7 },
    { id: "copypasta-creator", name: "Copypasta Creator", min: 105, max: 325, xp: 6 },
    { id: "bot-developer", name: "Bot Developer", min: 225, max: 625, xp: 12 },
    { id: "script-kiddie", name: "Script Kiddie", min: 80, max: 285, xp: 4 },
    { id: "tech-support-scammer", name: "Tech Support Scammer", min: 160, max: 460, xp: 8 },
    { id: "crypto-bro", name: "Crypto Bro", min: 190, max: 540, xp: 10 },
    { id: "day-trader", name: "Day Trader", min: 200, max: 565, xp: 10 },
    { id: "nft-flipper", name: "NFT Flipper", min: 185, max: 525, xp: 9 },
    { id: "ape-holder", name: "Bored Ape Holder", min: 210, max: 595, xp: 11 },
    { id: "metaverse-realtor", name: "Metaverse Realtor", min: 195, max: 555, xp: 10 },
    { id: "blockchain-expert", name: "Blockchain Expert", min: 230, max: 640, xp: 12 },
    { id: "web3-developer", name: "Web3 Developer", min: 240, max: 660, xp: 13 },
    { id: "dao-member", name: "DAO Member", min: 170, max: 495, xp: 9 },
    { id: "defi-farmer", name: "DeFi Farmer", min: 180, max: 515, xp: 9 },
    { id: "shitcoin-creator", name: "Shitcoin Creator", min: 155, max: 440, xp: 8 },
    { id: "rugpull-artist", name: "Rugpull Artist", min: 220, max: 615, xp: 11 },
    { id: "telegram-admin", name: "Telegram Admin", min: 125, max: 375, xp: 7 },
    { id: "whitepaper-writer", name: "Whitepaper Writer", min: 165, max: 475, xp: 8 },
    { id: "token-launcher", name: "Token Launcher", min: 205, max: 580, xp: 10 },
    { id: "pump-dumper", name: "Pump & Dumper", min: 175, max: 500, xp: 9 },
    { id: "whale-watcher", name: "Whale Watcher", min: 145, max: 415, xp: 8 },
    { id: "gas-fee-optimizer", name: "Gas Fee Optimizer", min: 135, max: 395, xp: 7 },
    { id: "smart-contract-auditor", name: "Smart Contract Auditor", min: 250, max: 680, xp: 14 },
    { id: "yield-optimizer", name: "Yield Optimizer", min: 190, max: 545, xp: 10 },
    { id: "liquidity-provider", name: "Liquidity Provider", min: 200, max: 570, xp: 10 },
    { id: "airdrop-hunter", name: "Airdrop Hunter", min: 150, max: 435, xp: 8 },
    { id: "whitelist-grinder", name: "Whitelist Grinder", min: 140, max: 405, xp: 7 },
    { id: "mint-sniper", name: "Mint Sniper", min: 215, max: 600, xp: 11 },
    { id: "floor-sweeper", name: "Floor Sweeper", min: 160, max: 465, xp: 8 },
    { id: "rarity-checker", name: "Rarity Checker", min: 130, max: 380, xp: 7 },
    { id: "trait-farmer", name: "Trait Farmer", min: 155, max: 450, xp: 8 },
    { id: "pfp-collector", name: "PFP Collector", min: 185, max: 530, xp: 9 },
    { id: "discord-raider", name: "Discord Raider", min: 95, max: 315, xp: 5 },
    { id: "shill-account", name: "Shill Account", min: 110, max: 340, xp: 6 },
    { id: "fud-spreader", name: "FUD Spreader", min: 120, max: 360, xp: 6 },
    { id: "hopium-dealer", name: "Hopium Dealer", min: 145, max: 420, xp: 7 },
    { id: "copium-supplier", name: "Copium Supplier", min: 135, max: 390, xp: 7 },
    { id: "wagmi-preacher", name: "WAGMI Preacher", min: 155, max: 445, xp: 8 },
    { id: "gm-sayer", name: "GM Sayer", min: 100, max: 300, xp: 5 },
    { id: "ngmi-warner", name: "NGMI Warner", min: 115, max: 350, xp: 6 },
    { id: "dyor-advisor", name: "DYOR Advisor", min: 140, max: 410, xp: 7 },
    { id: "nfa-disclaimer", name: "NFA Disclaimer Writer", min: 105, max: 320, xp: 6 },
    { id: "moon-predictor", name: "Moon Predictor", min: 130, max: 385, xp: 7 },
    { id: "chart-reader", name: "Chart Reader", min: 165, max: 470, xp: 8 },
    { id: "ta-expert", name: "TA Expert", min: 175, max: 510, xp: 9 },
    { id: "elliott-wave-theorist", name: "Elliott Wave Theorist", min: 195, max: 550, xp: 10 },
    { id: "fibonacci-drawer", name: "Fibonacci Drawer", min: 150, max: 430, xp: 8 },
    { id: "support-resistance-finder", name: "Support/Resistance Finder", min: 160, max: 455, xp: 8 },
    { id: "candlestick-pattern-spotter", name: "Candlestick Pattern Spotter", min: 170, max: 485, xp: 9 },
    { id: "volume-analyzer", name: "Volume Analyzer", min: 155, max: 440, xp: 8 },
    { id: "macd-crossover-trader", name: "MACD Crossover Trader", min: 165, max: 475, xp: 8 },
    { id: "rsi-divergence-hunter", name: "RSI Divergence Hunter", min: 175, max: 500, xp: 9 },
    { id: "bollinger-band-bouncer", name: "Bollinger Band Bouncer", min: 160, max: 460, xp: 8 },
    { id: "moving-average-master", name: "Moving Average Master", min: 170, max: 490, xp: 9 },
    { id: "head-shoulders-identifier", name: "Head & Shoulders Identifier", min: 155, max: 445, xp: 8 },
    { id: "cup-handle-finder", name: "Cup & Handle Finder", min: 150, max: 435, xp: 8 },
    { id: "double-top-spotter", name: "Double Top Spotter", min: 145, max: 425, xp: 7 },
    { id: "triangle-breakout-trader", name: "Triangle Breakout Trader", min: 185, max: 520, xp: 9 },
    { id: "wedge-pattern-player", name: "Wedge Pattern Player", min: 165, max: 470, xp: 8 },
    { id: "flag-pennant-trader", name: "Flag & Pennant Trader", min: 155, max: 450, xp: 8 },
    { id: "gap-trader", name: "Gap Trader", min: 175, max: 505, xp: 9 },
    { id: "swing-trader", name: "Swing Trader", min: 190, max: 535, xp: 10 },
    { id: "scalper", name: "Scalper", min: 125, max: 370, xp: 7 },
    { id: "hodler", name: "Professional HODLer", min: 200, max: 560, xp: 10 },
    { id: "paper-hands", name: "Paper Hands", min: 80, max: 280, xp: 4 },
    { id: "diamond-hands", name: "Diamond Hands", min: 220, max: 620, xp: 11 },
    { id: "bag-holder", name: "Bag Holder", min: 75, max: 275, xp: 4 },
    { id: "dip-buyer", name: "Dip Buyer", min: 165, max: 475, xp: 8 },
    { id: "fomo-trader", name: "FOMO Trader", min: 90, max: 310, xp: 5 },
    { id: "fud-victim", name: "FUD Victim", min: 85, max: 295, xp: 5 },
    { id: "revenge-trader", name: "Revenge Trader", min: 70, max: 265, xp: 4 },
    { id: "over-leveraged", name: "Over-Leveraged Gambler", min: 95, max: 325, xp: 6 },
    { id: "liquidation-survivor", name: "Liquidation Survivor", min: 115, max: 355, xp: 6 },
    { id: "stop-loss-hunter", name: "Stop Loss Hunter", min: 175, max: 495, xp: 9 },
    { id: "margin-caller", name: "Margin Caller", min: 140, max: 400, xp: 7 },
    { id: "short-squeezer", name: "Short Squeezer", min: 210, max: 590, xp: 11 },
    { id: "long-liquidator", name: "Long Liquidator", min: 200, max: 575, xp: 10 },
  ];

  // 100+ Crime options
  private static readonly CRIME_OPTIONS = [
    { id: "steal-meme", name: "Steal a rare meme", success: 0.8, coins: 200, fine: 100, xp: 10 },
    { id: "rob-server", name: "Rob a Discord server", success: 0.6, coins: 500, fine: 300, xp: 15 },
    { id: "hack-computer", name: "Hack someone's computer", success: 0.4, coins: 1000, fine: 600, xp: 25 },
    { id: "bank-heist", name: "Execute a bank heist", success: 0.2, coins: 2000, fine: 1200, xp: 50 },
    { id: "steal-nft", name: "Steal an NFT", success: 0.5, coins: 800, fine: 450, xp: 20 },
    { id: "phish-wallet", name: "Phish a crypto wallet", success: 0.45, coins: 900, fine: 500, xp: 22 },
    { id: "rug-pull", name: "Execute a rug pull", success: 0.3, coins: 1500, fine: 900, xp: 35 },
    { id: "insider-trading", name: "Insider trading", success: 0.35, coins: 1300, fine: 750, xp: 30 },
    { id: "tax-evasion", name: "Tax evasion", success: 0.7, coins: 400, fine: 200, xp: 12 },
    { id: "money-laundering", name: "Money laundering", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "steal-cookie", name: "Steal cookies from grandma", success: 0.85, coins: 150, fine: 75, xp: 8 },
    { id: "fake-giveaway", name: "Host a fake giveaway", success: 0.55, coins: 700, fine: 400, xp: 18 },
    { id: "impersonate-admin", name: "Impersonate a server admin", success: 0.5, coins: 750, fine: 425, xp: 19 },
    { id: "ddos-website", name: "DDoS a website", success: 0.35, coins: 1200, fine: 700, xp: 28 },
    { id: "sell-fakes", name: "Sell fake designer memes", success: 0.6, coins: 550, fine: 325, xp: 16 },
    { id: "copyright-infringement", name: "Copyright infringement", success: 0.65, coins: 450, fine: 250, xp: 14 },
    { id: "steal-art", name: "Steal digital art", success: 0.55, coins: 650, fine: 375, xp: 17 },
    { id: "forge-signature", name: "Forge a signature", success: 0.5, coins: 800, fine: 450, xp: 20 },
    { id: "identity-theft", name: "Identity theft", success: 0.3, coins: 1400, fine: 850, xp: 33 },
    { id: "credit-card-fraud", name: "Credit card fraud", success: 0.25, coins: 1800, fine: 1100, xp: 45 },
    { id: "pyramid-scheme", name: "Run a pyramid scheme", success: 0.4, coins: 1050, fine: 600, xp: 26 },
    { id: "ponzi-scheme", name: "Start a Ponzi scheme", success: 0.35, coins: 1250, fine: 725, xp: 29 },
    { id: "pump-dump", name: "Pump and dump scheme", success: 0.45, coins: 950, fine: 550, xp: 23 },
    { id: "wash-trading", name: "Wash trading", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "fake-news", name: "Spread fake news for profit", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "market-manipulation", name: "Market manipulation", success: 0.35, coins: 1300, fine: 775, xp: 31 },
    { id: "bribe-official", name: "Bribe a government official", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "embezzlement", name: "Embezzlement", success: 0.3, coins: 1500, fine: 900, xp: 36 },
    { id: "blackmail", name: "Blackmail someone", success: 0.45, coins: 1000, fine: 575, xp: 24 },
    { id: "extortion", name: "Extortion", success: 0.4, coins: 1150, fine: 675, xp: 28 },
    { id: "kidnapping", name: "Kidnap a meme character", success: 0.15, coins: 2500, fine: 1500, xp: 60 },
    { id: "arson", name: "Commit arson at a server", success: 0.2, coins: 2200, fine: 1300, xp: 55 },
    { id: "vandalism", name: "Vandalize public property", success: 0.7, coins: 350, fine: 175, xp: 11 },
    { id: "graffiti", name: "Spray paint graffiti", success: 0.75, coins: 300, fine: 150, xp: 10 },
    { id: "shoplifting", name: "Shoplift rare items", success: 0.65, coins: 500, fine: 275, xp: 15 },
    { id: "pickpocket", name: "Pickpocket tourists", success: 0.7, coins: 400, fine: 200, xp: 12 },
    { id: "burglar", name: "Burgle a house", success: 0.45, coins: 950, fine: 525, xp: 23 },
    { id: "carjack", name: "Carjack a lambo", success: 0.25, coins: 1900, fine: 1150, xp: 48 },
    { id: "grand-theft-auto", name: "Grand theft auto", success: 0.2, coins: 2100, fine: 1250, xp: 52 },
    { id: "smuggling", name: "Smuggle contraband", success: 0.35, coins: 1350, fine: 800, xp: 32 },
    { id: "counterfeiting", name: "Counterfeit currency", success: 0.3, coins: 1600, fine: 950, xp: 38 },
    { id: "bootlegging", name: "Bootleg merchandise", success: 0.55, coins: 700, fine: 400, xp: 18 },
    { id: "loan-sharking", name: "Loan sharking", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "racketeering", name: "Racketeering", success: 0.3, coins: 1550, fine: 925, xp: 37 },
    { id: "witness-tampering", name: "Witness tampering", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "obstruction-justice", name: "Obstruction of justice", success: 0.45, coins: 1000, fine: 575, xp: 24 },
    { id: "perjury", name: "Commit perjury", success: 0.5, coins: 900, fine: 500, xp: 22 },
    { id: "contempt-court", name: "Contempt of court", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "drunk-driving", name: "Drunk driving (GTA style)", success: 0.55, coins: 750, fine: 425, xp: 19 },
    { id: "hit-run", name: "Hit and run", success: 0.4, coins: 1050, fine: 600, xp: 26 },
    { id: "reckless-driving", name: "Reckless driving", success: 0.65, coins: 450, fine: 250, xp: 14 },
    { id: "street-racing", name: "Illegal street racing", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "drag-racing", name: "Drag racing", success: 0.55, coins: 700, fine: 400, xp: 18 },
    { id: "drift-racing", name: "Drift racing", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "illegal-gambling", name: "Run illegal gambling ring", success: 0.4, coins: 1150, fine: 675, xp: 28 },
    { id: "fixed-matches", name: "Fix sports matches", success: 0.35, coins: 1300, fine: 775, xp: 31 },
    { id: "doping", name: "Doping scandal", success: 0.5, coins: 800, fine: 450, xp: 20 },
    { id: "match-throwing", name: "Throw a match", success: 0.55, coins: 750, fine: 425, xp: 19 },
    { id: "ticket-scalping", name: "Ticket scalping", success: 0.7, coins: 400, fine: 200, xp: 12 },
    { id: "price-gouging", name: "Price gouging", success: 0.6, coins: 550, fine: 325, xp: 16 },
    { id: "false-advertising", name: "False advertising", success: 0.65, coins: 500, fine: 275, xp: 15 },
    { id: "trademark-violation", name: "Trademark violation", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "patent-infringement", name: "Patent infringement", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "steal-trade-secrets", name: "Steal trade secrets", success: 0.35, coins: 1350, fine: 800, xp: 32 },
    { id: "corporate-espionage", name: "Corporate espionage", success: 0.25, coins: 1850, fine: 1100, xp: 46 },
    { id: "industrial-sabotage", name: "Industrial sabotage", success: 0.3, coins: 1550, fine: 925, xp: 37 },
    { id: "data-breach", name: "Cause a data breach", success: 0.35, coins: 1250, fine: 725, xp: 29 },
    { id: "ransomware", name: "Deploy ransomware", success: 0.25, coins: 1900, fine: 1150, xp: 48 },
    { id: "cryptojacking", name: "Cryptojacking", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "sim-swapping", name: "SIM swapping attack", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "credential-stuffing", name: "Credential stuffing", success: 0.55, coins: 750, fine: 425, xp: 19 },
    { id: "sql-injection", name: "SQL injection attack", success: 0.45, coins: 1000, fine: 575, xp: 24 },
    { id: "xss-attack", name: "XSS attack", success: 0.5, coins: 900, fine: 500, xp: 22 },
    { id: "csrf-attack", name: "CSRF attack", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "zero-day-exploit", name: "Zero-day exploit", success: 0.2, coins: 2300, fine: 1400, xp: 58 },
    { id: "brute-force", name: "Brute force attack", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "dictionary-attack", name: "Dictionary attack", success: 0.65, coins: 500, fine: 275, xp: 15 },
    { id: "rainbow-table", name: "Rainbow table attack", success: 0.55, coins: 700, fine: 400, xp: 18 },
    { id: "man-in-middle", name: "Man-in-the-middle attack", success: 0.4, coins: 1150, fine: 675, xp: 28 },
    { id: "dns-spoofing", name: "DNS spoofing", success: 0.45, coins: 950, fine: 550, xp: 23 },
    { id: "ip-spoofing", name: "IP spoofing", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "arp-poisoning", name: "ARP poisoning", success: 0.5, coins: 900, fine: 500, xp: 22 },
    { id: "session-hijacking", name: "Session hijacking", success: 0.45, coins: 1000, fine: 575, xp: 24 },
    { id: "cookie-theft", name: "Cookie theft", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "clickjacking", name: "Clickjacking", success: 0.65, coins: 450, fine: 250, xp: 14 },
    { id: "tabnabbing", name: "Tabnabbing", success: 0.6, coins: 550, fine: 325, xp: 16 },
    { id: "typosquatting", name: "Typosquatting", success: 0.7, coins: 400, fine: 200, xp: 12 },
    { id: "cybersquatting", name: "Cybersquatting", success: 0.65, coins: 500, fine: 275, xp: 15 },
    { id: "domain-hijacking", name: "Domain hijacking", success: 0.35, coins: 1300, fine: 775, xp: 31 },
    { id: "email-spoofing", name: "Email spoofing", success: 0.6, coins: 600, fine: 350, xp: 17 },
    { id: "sms-phishing", name: "SMS phishing", success: 0.65, coins: 450, fine: 250, xp: 14 },
    { id: "vishing", name: "Voice phishing (vishing)", success: 0.55, coins: 750, fine: 425, xp: 19 },
    { id: "whaling", name: "Whaling attack", success: 0.3, coins: 1600, fine: 950, xp: 38 },
    { id: "spear-phishing", name: "Spear phishing", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "clone-phishing", name: "Clone phishing", success: 0.5, coins: 850, fine: 475, xp: 21 },
    { id: "pharming", name: "Pharming", success: 0.45, coins: 950, fine: 550, xp: 23 },
    { id: "watering-hole", name: "Watering hole attack", success: 0.35, coins: 1250, fine: 725, xp: 29 },
    { id: "drive-by-download", name: "Drive-by download", success: 0.5, coins: 900, fine: 500, xp: 22 },
    { id: "malvertising", name: "Malvertising", success: 0.55, coins: 750, fine: 425, xp: 19 },
    { id: "trojan-horse", name: "Deploy trojan horse", success: 0.4, coins: 1100, fine: 650, xp: 27 },
    { id: "worm-spreading", name: "Spread a worm", success: 0.35, coins: 1350, fine: 800, xp: 32 },
    { id: "rootkit-install", name: "Install rootkit", success: 0.3, coins: 1500, fine: 900, xp: 36 },
  ];

  // 100+ Dig treasure options
  private static readonly DIG_OPTIONS = [
    { name: "Bottle Cap", coins: 20, xp: 2 },
    { name: "Old Coin", coins: 75, xp: 5 },
    { name: "Treasure Chest", coins: 200, xp: 10 },
    { name: "Ancient Artifact", coins: 500, xp: 20 },
    { name: "Pirate Treasure", coins: 800, xp: 30 },
    { name: "Legendary Gem", coins: 1500, xp: 40 },
    { name: "Dragon Hoard", coins: 3000, xp: 80 },
    { name: "Rusty Spoon", coins: 15, xp: 1 },
    { name: "Broken Watch", coins: 35, xp: 3 },
    { name: "Old Key", coins: 50, xp: 4 },
    { name: "Copper Ring", coins: 90, xp: 6 },
    { name: "Silver Necklace", coins: 150, xp: 8 },
    { name: "Gold Bracelet", coins: 250, xp: 12 },
    { name: "Diamond Ring", coins: 600, xp: 25 },
    { name: "Emerald Pendant", coins: 550, xp: 22 },
    { name: "Ruby Earrings", coins: 700, xp: 28 },
    { name: "Sapphire Brooch", coins: 650, xp: 26 },
    { name: "Platinum Chain", coins: 850, xp: 32 },
    { name: "Opal Tiara", coins: 950, xp: 35 },
    { name: "Topaz Crown", coins: 1100, xp: 38 },
    { name: "Amethyst Scepter", coins: 1300, xp: 42 },
    { name: "Pearl Diadem", coins: 1200, xp: 40 },
    { name: "Jade Statue", coins: 1400, xp: 45 },
    { name: "Ivory Figurine", coins: 900, xp: 33 },
    { name: "Bronze Medal", coins: 180, xp: 9 },
    { name: "Silver Trophy", coins: 320, xp: 15 },
    { name: "Gold Medal", coins: 480, xp: 19 },
    { name: "Championship Belt", coins: 720, xp: 29 },
    { name: "Rare Fossil", coins: 580, xp: 23 },
    { name: "Dinosaur Bone", coins: 850, xp: 31 },
    { name: "Meteorite Fragment", coins: 1250, xp: 41 },
    { name: "Moon Rock", coins: 1600, xp: 50 },
    { name: "Ancient Scroll", coins: 420, xp: 18 },
    { name: "Old Map", coins: 350, xp: 16 },
    { name: "Pirate Flag", coins: 280, xp: 13 },
    { name: "Ship's Wheel", coins: 540, xp: 21 },
    { name: "Anchor", coins: 380, xp: 17 },
    { name: "Compass", coins: 220, xp: 11 },
    { name: "Sextant", coins: 460, xp: 19 },
    { name: "Spyglass", coins: 340, xp: 15 },
    { name: "Cannonball", coins: 120, xp: 7 },
    { name: "Musket", coins: 620, xp: 24 },
    { name: "Cutlass", coins: 560, xp: 22 },
    { name: "Flintlock Pistol", coins: 680, xp: 27 },
    { name: "Powder Horn", coins: 240, xp: 12 },
    { name: "Treasure Map", coins: 780, xp: 30 },
    { name: "Buried Gold", coins: 1400, xp: 44 },
    { name: "Spanish Doubloon", coins: 320, xp: 15 },
    { name: "Pieces of Eight", coins: 280, xp: 13 },
    { name: "Roman Coin", coins: 450, xp: 18 },
    { name: "Greek Drachma", coins: 520, xp: 20 },
    { name: "Egyptian Scarab", coins: 880, xp: 33 },
    { name: "Mayan Mask", coins: 1050, xp: 37 },
    { name: "Aztec Calendar", coins: 1150, xp: 39 },
    { name: "Viking Helmet", coins: 920, xp: 34 },
    { name: "Samurai Sword", coins: 1320, xp: 43 },
    { name: "Knight's Shield", coins: 740, xp: 28 },
    { name: "Medieval Crown", coins: 1480, xp: 46 },
    { name: "Royal Scepter", coins: 1380, xp: 44 },
    { name: "Holy Grail", coins: 2500, xp: 70 },
    { name: "Excalibur", coins: 2800, xp: 75 },
    { name: "Mjolnir", coins: 2600, xp: 72 },
    { name: "Triforce", coins: 2200, xp: 65 },
    { name: "Master Sword", coins: 2400, xp: 68 },
    { name: "One Ring", coins: 3200, xp: 85 },
    { name: "Elder Wand", coins: 2900, xp: 78 },
    { name: "Infinity Stone", coins: 3500, xp: 90 },
    { name: "Dragon Ball", coins: 2700, xp: 73 },
    { name: "Chaos Emerald", coins: 2300, xp: 66 },
    { name: "Power Crystal", coins: 1900, xp: 55 },
    { name: "Magic Orb", coins: 1700, xp: 52 },
    { name: "Enchanted Amulet", coins: 1550, xp: 48 },
    { name: "Cursed Talisman", coins: 1850, xp: 54 },
    { name: "Blessed Charm", coins: 1450, xp: 45 },
    { name: "Lucky Clover", coins: 380, xp: 17 },
    { name: "Rabbit's Foot", coins: 280, xp: 13 },
    { name: "Horseshoe", coins: 220, xp: 11 },
    { name: "Wishing Well Coin", coins: 150, xp: 8 },
    { name: "Fountain Penny", coins: 25, xp: 2 },
    { name: "Lost Wallet", coins: 420, xp: 18 },
    { name: "Buried Cash", coins: 680, xp: 27 },
    { name: "Bank Bag", coins: 1200, xp: 40 },
    { name: "Safe Contents", coins: 1650, xp: 51 },
    { name: "Vault Treasure", coins: 2100, xp: 60 },
    { name: "Rare Stamp Collection", coins: 820, xp: 31 },
    { name: "Antique Book", coins: 620, xp: 24 },
    { name: "First Edition Comic", coins: 950, xp: 35 },
    { name: "Vintage Vinyl", coins: 540, xp: 21 },
    { name: "Classic Guitar", coins: 780, xp: 29 },
    { name: "Old Painting", coins: 1100, xp: 38 },
    { name: "Ancient Vase", coins: 860, xp: 32 },
    { name: "Antique Clock", coins: 720, xp: 28 },
    { name: "Vintage Camera", coins: 580, xp: 23 },
    { name: "Old Typewriter", coins: 460, xp: 19 },
    { name: "Retro Console", coins: 640, xp: 25 },
    { name: "Arcade Machine", coins: 1280, xp: 42 },
    { name: "Pinball Machine", coins: 1180, xp: 39 },
    { name: "Jukebox", coins: 1420, xp: 45 },
    { name: "Neon Sign", coins: 880, xp: 33 },
    { name: "Vintage Poster", coins: 340, xp: 15 },
    { name: "Collector's Card", coins: 520, xp: 20 },
    { name: "Limited Edition Figure", coins: 780, xp: 29 },
  ];

  // 100+ Fish options
  private static readonly FISH_OPTIONS = [
    { name: "Pepe Fish", coins: 50, xp: 8 },
    { name: "Doge Fish", coins: 100, xp: 12 },
    { name: "Diamond Fish", coins: 200, xp: 20 },
    { name: "Golden Fish", coins: 500, xp: 30 },
    { name: "Legendary Fish", coins: 1000, xp: 50 },
    { name: "Mythical Kraken Fish", coins: 2000, xp: 100 },
    { name: "Minnow", coins: 25, xp: 5 },
    { name: "Guppy", coins: 30, xp: 6 },
    { name: "Goldfish", coins: 60, xp: 9 },
    { name: "Koi", coins: 180, xp: 18 },
    { name: "Beta Fish", coins: 90, xp: 11 },
    { name: "Angelfish", coins: 140, xp: 15 },
    { name: "Clownfish", coins: 120, xp: 13 },
    { name: "Nemo", coins: 250, xp: 22 },
    { name: "Dory", coins: 220, xp: 21 },
    { name: "Rainbow Trout", coins: 150, xp: 16 },
    { name: "Brown Trout", coins: 130, xp: 14 },
    { name: "Brook Trout", coins: 110, xp: 12 },
    { name: "Salmon", coins: 280, xp: 24 },
    { name: "King Salmon", coins: 420, xp: 28 },
    { name: "Sockeye Salmon", coins: 380, xp: 26 },
    { name: "Atlantic Salmon", coins: 340, xp: 25 },
    { name: "Rainbow Salmon", coins: 460, xp: 29 },
    { name: "Bass", coins: 160, xp: 17 },
    { name: "Largemouth Bass", coins: 240, xp: 21 },
    { name: "Smallmouth Bass", coins: 210, xp: 20 },
    { name: "Striped Bass", coins: 290, xp: 23 },
    { name: "Sea Bass", coins: 200, xp: 19 },
    { name: "Catfish", coins: 170, xp: 17 },
    { name: "Channel Catfish", coins: 190, xp: 18 },
    { name: "Flathead Catfish", coins: 230, xp: 21 },
    { name: "Blue Catfish", coins: 260, xp: 22 },
    { name: "Pike", coins: 320, xp: 25 },
    { name: "Northern Pike", coins: 380, xp: 27 },
    { name: "Muskellunge", coins: 520, xp: 32 },
    { name: "Pickerel", coins: 280, xp: 23 },
    { name: "Walleye", coins: 300, xp: 24 },
    { name: "Perch", coins: 140, xp: 15 },
    { name: "Yellow Perch", coins: 160, xp: 16 },
    { name: "White Perch", coins: 150, xp: 15 },
    { name: "Crappie", coins: 130, xp: 14 },
    { name: "Black Crappie", coins: 150, xp: 15 },
    { name: "White Crappie", coins: 140, xp: 14 },
    { name: "Sunfish", coins: 80, xp: 10 },
    { name: "Bluegill", coins: 100, xp: 11 },
    { name: "Pumpkinseed", coins: 90, xp: 10 },
    { name: "Carp", coins: 180, xp: 18 },
    { name: "Common Carp", coins: 200, xp: 19 },
    { name: "Mirror Carp", coins: 240, xp: 21 },
    { name: "Grass Carp", coins: 220, xp: 20 },
    { name: "Koi Carp", coins: 360, xp: 26 },
    { name: "Tuna", coins: 450, xp: 29 },
    { name: "Bluefin Tuna", coins: 800, xp: 40 },
    { name: "Yellowfin Tuna", coins: 650, xp: 35 },
    { name: "Albacore Tuna", coins: 550, xp: 32 },
    { name: "Skipjack Tuna", coins: 480, xp: 30 },
    { name: "Marlin", coins: 900, xp: 45 },
    { name: "Blue Marlin", coins: 1200, xp: 55 },
    { name: "Black Marlin", coins: 1100, xp: 52 },
    { name: "White Marlin", coins: 950, xp: 48 },
    { name: "Sailfish", coins: 850, xp: 42 },
    { name: "Swordfish", coins: 780, xp: 38 },
    { name: "Mahi-Mahi", coins: 420, xp: 28 },
    { name: "Wahoo", coins: 580, xp: 33 },
    { name: "Barracuda", coins: 520, xp: 31 },
    { name: "Shark", coins: 1400, xp: 60 },
    { name: "Great White Shark", coins: 2200, xp: 80 },
    { name: "Hammerhead Shark", coins: 1800, xp: 70 },
    { name: "Tiger Shark", coins: 1650, xp: 68 },
    { name: "Bull Shark", coins: 1550, xp: 65 },
    { name: "Mako Shark", coins: 1950, xp: 75 },
    { name: "Whale Shark", coins: 2500, xp: 90 },
    { name: "Megalodon", coins: 5000, xp: 150 },
    { name: "Stingray", coins: 380, xp: 27 },
    { name: "Manta Ray", coins: 680, xp: 36 },
    { name: "Electric Ray", coins: 520, xp: 31 },
    { name: "Octopus", coins: 460, xp: 29 },
    { name: "Giant Octopus", coins: 980, xp: 49 },
    { name: "Squid", coins: 320, xp: 25 },
    { name: "Giant Squid", coins: 1300, xp: 58 },
    { name: "Colossal Squid", coins: 1800, xp: 72 },
    { name: "Kraken", coins: 3500, xp: 110 },
    { name: "Lobster", coins: 340, xp: 25 },
    { name: "Giant Lobster", coins: 720, xp: 37 },
    { name: "Crab", coins: 220, xp: 20 },
    { name: "King Crab", coins: 580, xp: 33 },
    { name: "Snow Crab", coins: 420, xp: 28 },
    { name: "Dungeness Crab", coins: 380, xp: 27 },
    { name: "Blue Crab", coins: 280, xp: 23 },
    { name: "Hermit Crab", coins: 120, xp: 13 },
    { name: "Shrimp", coins: 150, xp: 15 },
    { name: "Tiger Shrimp", coins: 280, xp: 23 },
    { name: "Prawn", coins: 240, xp: 21 },
    { name: "Scallop", coins: 320, xp: 25 },
    { name: "Oyster", coins: 260, xp: 22 },
    { name: "Pearl Oyster", coins: 880, xp: 43 },
    { name: "Clam", coins: 180, xp: 18 },
    { name: "Mussel", coins: 140, xp: 15 },
    { name: "Snail", coins: 80, xp: 10 },
  ];

  // 100+ Search location options
  private static readonly SEARCH_OPTIONS = [
    { id: "couch", name: "under the couch", coins: { min: 10, max: 50 }, itemChance: 0.05 },
    { id: "vault", name: "in the meme vault", coins: { min: 30, max: 100 }, itemChance: 0.15 },
    { id: "dumpster", name: "behind a dumpster", coins: { min: 5, max: 30 }, itemChance: 0.08 },
    { id: "pond", name: "in Pepe's pond", coins: { min: 20, max: 80 }, itemChance: 0.12 },
    { id: "rock", name: "under a rock", coins: { min: 10, max: 40 }, itemChance: 0.06 },
    { id: "purse", name: "in your mom's purse", coins: { min: 40, max: 120 }, itemChance: 0.2, special: true },
    { id: "attic", name: "in the dusty attic", coins: { min: 25, max: 75 }, itemChance: 0.1 },
    { id: "basement", name: "in the creepy basement", coins: { min: 15, max: 60 }, itemChance: 0.09 },
    { id: "garage", name: "in the messy garage", coins: { min: 20, max: 70 }, itemChance: 0.11 },
    { id: "shed", name: "in the old shed", coins: { min: 18, max: 65 }, itemChance: 0.08 },
    { id: "car", name: "in the car seats", coins: { min: 22, max: 68 }, itemChance: 0.1 },
    { id: "trunk", name: "in the car trunk", coins: { min: 28, max: 85 }, itemChance: 0.13 },
    { id: "glovebox", name: "in the glove box", coins: { min: 15, max: 55 }, itemChance: 0.07 },
    { id: "backpack", name: "in an old backpack", coins: { min: 12, max: 48 }, itemChance: 0.06 },
    { id: "drawer", name: "in the junk drawer", coins: { min: 8, max: 42 }, itemChance: 0.05 },
    { id: "closet", name: "in the messy closet", coins: { min: 16, max: 58 }, itemChance: 0.08 },
    { id: "pocket", name: "in your winter coat pocket", coins: { min: 18, max: 62 }, itemChance: 0.09 },
    { id: "washing-machine", name: "in the washing machine", coins: { min: 24, max: 72 }, itemChance: 0.11 },
    { id: "dryer", name: "in the dryer lint trap", coins: { min: 14, max: 52 }, itemChance: 0.07 },
    { id: "fridge", name: "behind the fridge", coins: { min: 20, max: 66 }, itemChance: 0.1 },
    { id: "oven", name: "under the oven", coins: { min: 17, max: 61 }, itemChance: 0.08 },
    { id: "bed", name: "under the bed", coins: { min: 19, max: 64 }, itemChance: 0.09 },
    { id: "mattress", name: "between mattresses", coins: { min: 35, max: 95 }, itemChance: 0.14 },
    { id: "pillow", name: "inside the pillowcase", coins: { min: 12, max: 46 }, itemChance: 0.06 },
    { id: "bookshelf", name: "behind the books", coins: { min: 21, max: 69 }, itemChance: 0.1 },
    { id: "desk", name: "in the desk drawer", coins: { min: 16, max: 56 }, itemChance: 0.08 },
    { id: "computer", name: "inside the computer", coins: { min: 26, max: 78 }, itemChance: 0.12 },
    { id: "keyboard", name: "under the keyboard", coins: { min: 10, max: 44 }, itemChance: 0.05 },
    { id: "mouse-pad", name: "under the mouse pad", coins: { min: 8, max: 38 }, itemChance: 0.04 },
    { id: "monitor", name: "behind the monitor", coins: { min: 14, max: 50 }, itemChance: 0.07 },
    { id: "speakers", name: "inside the speakers", coins: { min: 18, max: 60 }, itemChance: 0.09 },
    { id: "gaming-chair", name: "in the gaming chair", coins: { min: 22, max: 70 }, itemChance: 0.1 },
    { id: "bean-bag", name: "in the bean bag", coins: { min: 16, max: 54 }, itemChance: 0.08 },
    { id: "nightstand", name: "in the nightstand", coins: { min: 19, max: 63 }, itemChance: 0.09 },
    { id: "dresser", name: "in the dresser", coins: { min: 23, max: 71 }, itemChance: 0.11 },
    { id: "wardrobe", name: "in the wardrobe", coins: { min: 21, max: 67 }, itemChance: 0.1 },
    { id: "shoe-box", name: "in the shoe box", coins: { min: 15, max: 53 }, itemChance: 0.07 },
    { id: "toy-chest", name: "in the toy chest", coins: { min: 17, max: 59 }, itemChance: 0.08 },
    { id: "lego-bin", name: "in the LEGO bin", coins: { min: 13, max: 49 }, itemChance: 0.06 },
    { id: "bathroom-cabinet", name: "in the bathroom cabinet", coins: { min: 11, max: 45 }, itemChance: 0.06 },
    { id: "medicine-cabinet", name: "in the medicine cabinet", coins: { min: 16, max: 56 }, itemChance: 0.08 },
    { id: "toilet-tank", name: "in the toilet tank", coins: { min: 28, max: 82 }, itemChance: 0.12 },
    { id: "shower", name: "behind the shower curtain", coins: { min: 9, max: 41 }, itemChance: 0.05 },
    { id: "bathtub", name: "under the bathtub", coins: { min: 20, max: 65 }, itemChance: 0.09 },
    { id: "laundry-basket", name: "in the laundry basket", coins: { min: 14, max: 51 }, itemChance: 0.07 },
    { id: "trash-can", name: "in the trash can", coins: { min: 7, max: 36 }, itemChance: 0.04 },
    { id: "recycle-bin", name: "in the recycle bin", coins: { min: 10, max: 43 }, itemChance: 0.05 },
    { id: "compost", name: "in the compost heap", coins: { min: 6, max: 32 }, itemChance: 0.03 },
    { id: "garden", name: "in the garden", coins: { min: 18, max: 62 }, itemChance: 0.09 },
    { id: "flower-pot", name: "in the flower pot", coins: { min: 12, max: 47 }, itemChance: 0.06 },
    { id: "birdhouse", name: "in the birdhouse", coins: { min: 15, max: 54 }, itemChance: 0.07 },
    { id: "mailbox", name: "in the mailbox", coins: { min: 17, max: 58 }, itemChance: 0.08 },
    { id: "newspaper", name: "inside the newspaper", coins: { min: 8, max: 39 }, itemChance: 0.04 },
    { id: "pizza-box", name: "in the pizza box", coins: { min: 13, max: 48 }, itemChance: 0.06 },
    { id: "cereal-box", name: "in the cereal box", coins: { min: 11, max: 44 }, itemChance: 0.05 },
    { id: "cookie-jar", name: "in the cookie jar", coins: { min: 19, max: 64 }, itemChance: 0.09 },
    { id: "pantry", name: "in the pantry", coins: { min: 16, max: 57 }, itemChance: 0.08 },
    { id: "freezer", name: "in the freezer", coins: { min: 22, max: 69 }, itemChance: 0.1 },
    { id: "dishwasher", name: "in the dishwasher", coins: { min: 14, max: 50 }, itemChance: 0.07 },
    { id: "microwave", name: "in the microwave", coins: { min: 15, max: 52 }, itemChance: 0.07 },
    { id: "toaster", name: "in the toaster", coins: { min: 9, max: 40 }, itemChance: 0.05 },
    { id: "blender", name: "in the blender", coins: { min: 12, max: 46 }, itemChance: 0.06 },
    { id: "coffee-maker", name: "in the coffee maker", coins: { min: 17, max: 59 }, itemChance: 0.08 },
    { id: "teapot", name: "in the teapot", coins: { min: 13, max: 49 }, itemChance: 0.06 },
    { id: "sugar-bowl", name: "in the sugar bowl", coins: { min: 10, max: 42 }, itemChance: 0.05 },
    { id: "bread-box", name: "in the bread box", coins: { min: 14, max: 51 }, itemChance: 0.07 },
    { id: "spice-rack", name: "behind the spice rack", coins: { min: 11, max: 45 }, itemChance: 0.06 },
    { id: "cutting-board", name: "under the cutting board", coins: { min: 8, max: 37 }, itemChance: 0.04 },
    { id: "pot", name: "in the cooking pot", coins: { min: 15, max: 53 }, itemChance: 0.07 },
    { id: "pan", name: "in the frying pan", coins: { min: 13, max: 48 }, itemChance: 0.06 },
    { id: "lunchbox", name: "in the old lunchbox", coins: { min: 16, max: 55 }, itemChance: 0.08 },
    { id: "thermos", name: "in the thermos", coins: { min: 12, max: 46 }, itemChance: 0.06 },
    { id: "water-bottle", name: "in the water bottle", coins: { min: 9, max: 41 }, itemChance: 0.05 },
    { id: "gym-bag", name: "in the gym bag", coins: { min: 18, max: 61 }, itemChance: 0.09 },
    { id: "sports-equipment", name: "with sports equipment", coins: { min: 20, max: 66 }, itemChance: 0.09 },
    { id: "tennis-racket", name: "in the tennis racket bag", coins: { min: 15, max: 52 }, itemChance: 0.07 },
    { id: "golf-bag", name: "in the golf bag", coins: { min: 24, max: 73 }, itemChance: 0.11 },
    { id: "bowling-ball-bag", name: "in the bowling ball bag", coins: { min: 17, max: 58 }, itemChance: 0.08 },
    { id: "bike", name: "on the bike", coins: { min: 19, max: 63 }, itemChance: 0.09 },
    { id: "scooter", name: "in the scooter", coins: { min: 14, max: 50 }, itemChance: 0.07 },
    { id: "skateboard", name: "under the skateboard", coins: { min: 12, max: 47 }, itemChance: 0.06 },
    { id: "rollerblades", name: "in the rollerblades", coins: { min: 13, max: 48 }, itemChance: 0.06 },
    { id: "helmet", name: "in the helmet", coins: { min: 11, max: 44 }, itemChance: 0.05 },
    { id: "toolbox", name: "in the toolbox", coins: { min: 21, max: 68 }, itemChance: 0.1 },
    { id: "tackle-box", name: "in the tackle box", coins: { min: 19, max: 64 }, itemChance: 0.09 },
    { id: "sewing-kit", name: "in the sewing kit", coins: { min: 14, max: 51 }, itemChance: 0.07 },
    { id: "art-supplies", name: "in the art supplies", coins: { min: 16, max: 55 }, itemChance: 0.08 },
    { id: "paint-can", name: "in the paint can", coins: { min: 18, max: 60 }, itemChance: 0.09 },
    { id: "bucket", name: "in the bucket", coins: { min: 13, max: 49 }, itemChance: 0.06 },
    { id: "planter", name: "in the planter", coins: { min: 15, max: 53 }, itemChance: 0.07 },
    { id: "watering-can", name: "in the watering can", coins: { min: 11, max: 45 }, itemChance: 0.06 },
    { id: "hose", name: "in the garden hose", coins: { min: 9, max: 40 }, itemChance: 0.05 },
    { id: "sandbox", name: "in the sandbox", coins: { min: 17, max: 59 }, itemChance: 0.08 },
    { id: "treehouse", name: "in the treehouse", coins: { min: 23, max: 71 }, itemChance: 0.11 },
    { id: "doghouse", name: "in the doghouse", coins: { min: 16, max: 56 }, itemChance: 0.08 },
  ];

  // Bank operations
  static async deposit(username: string, amount: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (user.coins < amount) {
      throw new Error("Insufficient coins");
    }

    const newBankAmount = user.bank + amount;
    if (newBankAmount > user.bankCapacity) {
      throw new Error("Bank capacity exceeded");
    }

    await storage.updateUser(user.id, {
      coins: user.coins - amount,
      bank: newBankAmount,
    });

    await storage.createTransaction({
      user: username,
      type: "transfer",
      amount,
      targetUser: null,
      description: `Deposited ${amount} coins to bank`,
    });

    return {
      success: true,
      newCoins: user.coins - amount,
      newBank: newBankAmount,
    };
  }

  static async withdraw(username: string, amount: number) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (user.bank < amount) {
      throw new Error("Insufficient bank balance");
    }

    const fee = Math.floor(amount * 0.01); // 1% fee
    const netAmount = amount - fee;

    await storage.updateUser(user.id, {
      coins: user.coins + netAmount,
      bank: user.bank - amount,
    });

    await storage.createTransaction({
      user: username,
      type: "transfer",
      amount: netAmount,
      targetUser: null,
      description: `Withdrew ${amount} coins from bank (${fee} fee)`,
    });

    return {
      success: true,
      newCoins: user.coins + netAmount,
      newBank: user.bank - amount,
      fee,
    };
  }

  // Transfer coins
  static async transfer(
    username: string,
    targetUsername: string,
    amount: number,
    message?: string,
  ) {
    const user = await storage.getUserByUsername(username);
    const targetUser = await storage.getUserByUsername(targetUsername);

    if (!user) throw new Error("User not found");
    if (!targetUser) throw new Error("Target user not found");

    if (username === targetUsername) {
      throw new Error("Cannot transfer to yourself");
    }

    if (amount < 10) {
      throw new Error("Minimum transfer amount is 10 coins");
    }

    const fee = amount > 1000 ? Math.floor(amount * 0.05) : 0; // 5% fee for >1000
    const totalCost = amount + fee;

    if (user.coins < totalCost) {
      throw new Error("Insufficient coins (including fee)");
    }

    await storage.updateUser(user.id, {
      coins: user.coins - totalCost,
    });

    await storage.updateUser(targetUser.id, {
      coins: targetUser.coins + amount,
    });

    // Create transactions
    await storage.createTransaction({
      user: username,
      type: "transfer",
      amount: totalCost,
      targetUser: targetUsername,
      description: `Sent ${amount} coins to ${targetUsername}${fee > 0 ? ` (${fee} fee)` : ""}`,
    });

    await storage.createTransaction({
      user: targetUsername,
      type: "earn",
      amount: amount,
      targetUser: username,
      description: `Received ${amount} coins from ${username}`,
    });

    // Create notification
    await storage.createNotification({
      user: targetUsername,
      message: `${username} sent you ${amount} coins${message ? `: ${message}` : ""}`,
      type: "system",
      read: false,
    });

    return {
      success: true,
      sent: amount,
      fee,
      newBalance: user.coins - totalCost,
    };
  }

  // Rob system
  static async rob(
    username: string,
    targetUsername: string,
    betAmount: number,
  ) {
    const user = await storage.getUserByUsername(username);
    const targetUser = await storage.getUserByUsername(targetUsername);

    if (!user) throw new Error("User not found");
    if (!targetUser) throw new Error("Target user not found");

    if (username === targetUsername) {
      throw new Error("Cannot rob yourself");
    }

    // Check cooldown
    const now = Date.now();
    const robCooldown = 10 * 1000; // 10 seconds

    if (user.lastRob && now - user.lastRob.getTime() < robCooldown) {
      const remaining = robCooldown - (now - user.lastRob.getTime());
      throw new Error(
        `Rob cooldown: ${Math.ceil(remaining / (60 * 1000))} minutes remaining`,
      );
    }

    const maxBet = Math.floor(user.coins * 0.2); // Max 20% of coins
    if (betAmount > maxBet) {
      throw new Error(`Maximum bet is 20% of your coins (${maxBet})`);
    }

    if (user.coins < betAmount) {
      throw new Error("Insufficient coins to bet");
    }

    if (targetUser.coins < betAmount * 0.5) {
      throw new Error("Target doesn't have enough coins to rob");
    }

    // Calculate success chance based on level difference and items
    const levelDiff = user.level - targetUser.level;
    let successChance = 0.3 + levelDiff * 0.05; // Base 30% + 5% per level advantage

    // Apply item effects (simplified)
    const luckPotion = user.inventory.find(
      (item) => item.itemId.includes("luck") && item.equipped,
    );
    if (luckPotion) successChance += 0.175;

    successChance = Math.max(0.1, Math.min(0.8, successChance)); // Clamp between 10% and 80%

    const success = Math.random() < successChance;

    if (success) {
      const stolenAmount = Math.floor(betAmount * (0.2 + Math.random() * 0.3)); // 20-50% of bet

      const successMessages = [
        "You snatched the coins like a meme lord! 💰",
        "They didn't even see you coming! 😎",
        "Sneak 100! Mission accomplished! 🥷",
        "You're a natural-born thief! 🎭",
        "Easy money! They should've protected it better! 🤑",
        "Heist successful! Time to celebrate! 🎉",
        "Smooth criminal vibes! 🕺",
      ];

      await storage.updateUser(user.id, {
        coins: user.coins + stolenAmount,
        lastRob: new Date(now),
      });

      await storage.updateUser(targetUser.id, {
        coins: Math.max(0, targetUser.coins - stolenAmount),
      });

      // Transactions
      await storage.createTransaction({
        user: username,
        type: "rob",
        amount: stolenAmount,
        targetUser: targetUsername,
        description: `Successfully robbed ${stolenAmount} coins from ${targetUsername}`,
      });

      await storage.createTransaction({
        user: targetUsername,
        type: "fine",
        amount: stolenAmount,
        targetUser: username,
        description: `Robbed by ${username} for ${stolenAmount} coins`,
      });

      // Notify target
      await storage.createNotification({
        user: targetUsername,
        message: `${username} robbed ${stolenAmount} coins from you! 💸`,
        type: "rob",
        read: false,
      });

      const randomMessage =
        successMessages[Math.floor(Math.random() * successMessages.length)];

      return {
        success: true,
        stolen: stolenAmount,
        newBalance: user.coins + stolenAmount,
        message: `${randomMessage} You stole ${stolenAmount} coins!`,
      };
    } else {
      // Failed rob - lose bet amount + fine
      const fine = Math.floor(betAmount * 0.5);
      const totalLoss = betAmount + fine;

      const failureMessages = [
        "They slapped you so hard you saw stars! ⭐😵",
        "You tripped over your own feet! Clumsy much? 🤦",
        "Got caught red-handed! How embarrassing! 😳",
        "They called the cops on you! 🚨",
        "You ran into a wall trying to escape! 🧱💥",
        "Epic fail! Better luck next time! 😅",
        "They uno-reversed your robbery attempt! 🔄",
      ];

      await storage.updateUser(user.id, {
        coins: Math.max(0, user.coins - totalLoss),
        lastRob: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "fine",
        amount: totalLoss,
        targetUser: targetUsername,
        description: `Failed rob attempt on ${targetUsername} - lost ${totalLoss} coins`,
      });

      // Notify target of failed attempt
      await storage.createNotification({
        user: targetUsername,
        message: `${username} tried to rob you but failed! They lost ${totalLoss} coins 😂`,
        type: "rob",
        read: false,
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        lost: totalLoss,
        newBalance: Math.max(0, user.coins - totalLoss),
        message: `${randomMessage} Lost ${totalLoss} coins (${betAmount} bet + ${fine} fine)!`,
      };
    }
  }

  // Check if Friday boost is active
  private static isFridayBoost(): boolean {
    const now = new Date();
    return now.getDay() === 5; // 0 = Sunday, 5 = Friday
  }

  // Daily commands
  static async claimDaily(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const dailyCooldown = 10 * 1000; // 10 seconds

    if (
      user.lastDailyClaim &&
      now - user.lastDailyClaim.getTime() < dailyCooldown
    ) {
      const remaining = dailyCooldown - (now - user.lastDailyClaim.getTime());
      throw new Error(
        `Daily cooldown: ${Math.ceil(remaining / (60 * 60 * 1000))} hours remaining`,
      );
    }

    const isFriday = this.isFridayBoost();
    let amount = 200 + Math.floor(Math.random() * 801); // 200-1000 coins
    let xpGain = 50;

    // Apply Friday boost
    if (isFriday) {
      amount = Math.floor(amount * 1.5); // 50% more coins
      xpGain = Math.floor(xpGain * 2); // 2x XP
    }

    // 5% chance for bonus item
    let bonusItem = null;
    if (Math.random() < 0.05) {
      const items = await storage.getAllItems();
      const rareItems = items.filter((item) => item.rarity === "rare");
      if (rareItems.length > 0) {
        bonusItem = rareItems[Math.floor(Math.random() * rareItems.length)];
      }
    }

    const updates: any = {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      lastDailyClaim: new Date(now),
    };

    if (bonusItem) {
      const existingItem = user.inventory.find(
        (item) => item.itemId === bonusItem.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.inventory.push({
          itemId: bonusItem.id,
          quantity: 1,
          equipped: false,
        });
      }
      updates.inventory = user.inventory;
    }

    await storage.updateUser(user.id, updates);

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount,
      targetUser: null,
      description: `Daily reward: ${amount} coins, ${xpGain} XP${bonusItem ? ` + ${bonusItem.name}` : ""}${isFriday ? " [FRIDAY BOOST]" : ""}`,
    });

    return {
      success: true,
      coins: amount,
      xp: xpGain,
      bonusItem,
      newBalance: user.coins + amount,
      newXP: user.xp + xpGain,
      fridayBoost: isFriday,
    };
  }

  static async work(username: string, jobType?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const workCooldown = 10 * 1000; // 10 seconds

    if (user.lastWork && now - user.lastWork.getTime() < workCooldown) {
      const remaining = workCooldown - (now - user.lastWork.getTime());
      throw new Error(
        `Work cooldown: ${Math.ceil(remaining / 60000)} minutes remaining`,
      );
    }

    // Randomly select a job from the 100+ options
    const job = this.WORK_OPTIONS[Math.floor(Math.random() * this.WORK_OPTIONS.length)];

    const amount =
      job.min + Math.floor(Math.random() * (job.max - job.min + 1));
    const xpGain = job.xp;

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      lastWork: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount,
      targetUser: null,
      description: `Work as ${job.name}: ${amount} coins, ${xpGain} XP`,
    });

    return {
      success: true,
      job: job.name,
      coins: amount,
      xp: xpGain,
      newBalance: user.coins + amount,
      newXP: user.xp + xpGain,
    };
  }

  static async beg(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const begCooldown = 10 * 1000; // 10 seconds

    if (user.lastBeg && now - user.lastBeg.getTime() < begCooldown) {
      const remaining = begCooldown - (now - user.lastBeg.getTime());
      throw new Error(
        `Beg cooldown: ${Math.ceil(remaining / 60000)} minutes remaining`,
      );
    }

    const success = Math.random() > 0.3; // 70% success rate
    if (!success) {
      const failMessages = [
        "A wild Elon appears and ignores you! 😔",
        "The meme gods are not pleased today",
        "Someone threw a banana at you instead of coins",
        "You got distracted by a cute doggo and forgot to beg",
      ];

      await storage.updateUser(user.id, { lastBeg: new Date(now) });

      return {
        success: false,
        message: failMessages[Math.floor(Math.random() * failMessages.length)],
        coins: 0,
        newBalance: user.coins,
      };
    }

    const amount = Math.floor(Math.random() * 151); // 0-150 coins
    const xpGain = 2;

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      lastBeg: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount,
      targetUser: null,
      description: `Begging: ${amount} coins, ${xpGain} XP`,
    });

    return {
      success: true,
      coins: amount,
      xp: xpGain,
      newBalance: user.coins + amount,
      newXP: user.xp + xpGain,
      message: `Someone took pity on you and gave ${amount} coins! 🥺`,
    };
  }

  static async search(username: string, location?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const searchCooldown = 10 * 1000; // 10 seconds

    if (user.lastSearch && now - user.lastSearch.getTime() < searchCooldown) {
      const remaining = searchCooldown - (now - user.lastSearch.getTime());
      throw new Error(
        `Search cooldown: ${Math.ceil(remaining / 60000)} minutes remaining`,
      );
    }

    // Randomly select a search location from the 100+ options
    const searchLocation = this.SEARCH_OPTIONS[Math.floor(Math.random() * this.SEARCH_OPTIONS.length)];
    const locationName = searchLocation.name;

    // Special handling for 'purse' location - 70% success, 30% failure
    if (searchLocation.special) {
      const purseSuccess = Math.random() < 0.7;

      if (purseSuccess) {
        const amount =
          searchLocation.coins.min +
          Math.floor(
            Math.random() *
              (searchLocation.coins.max - searchLocation.coins.min + 1),
          );
        const successMessages = [
          "Mom caught you but gave you the money anyway! 💸",
          "You found her secret stash! Shhh... 🤫",
          "She was in a good mood! Lucky you! 😊",
          "You're her favorite child! 🥰",
        ];

        const updates: any = {
          coins: user.coins + amount,
          xp: user.xp + 2,
          lastSearch: new Date(now),
        };

        await storage.updateUser(user.id, updates);

        await storage.createTransaction({
          user: username,
          type: "earn",
          amount,
          targetUser: null,
          description: `Searched ${locationName}: ${amount} coins`,
        });

        const randomMessage =
          successMessages[Math.floor(Math.random() * successMessages.length)];

        return {
          success: true,
          location: locationName,
          coins: amount,
          foundItem: null,
          newBalance: user.coins + amount,
          message: `${randomMessage} Got ${amount} coins!`,
        };
      } else {
        // Failed - mom caught you and punishment
        const punishment = 20 + Math.floor(Math.random() * 31); // 20-50 coins
        const failureMessages = [
          "Mom slapped you really hard! 😭",
          "She made you do ALL the chores! 🧹",
          "Grounded for a week! Worth it? 🚫",
          "She gave you THE LOOK! Run! 😰",
        ];

        const updates: any = {
          coins: Math.max(0, user.coins - punishment),
          lastSearch: new Date(now),
        };

        await storage.updateUser(user.id, updates);

        await storage.createTransaction({
          user: username,
          type: "fine",
          amount: punishment,
          targetUser: null,
          description: `Caught searching mom's purse - fined ${punishment} coins`,
        });

        const randomMessage =
          failureMessages[Math.floor(Math.random() * failureMessages.length)];

        return {
          success: false,
          location: locationName,
          coins: -punishment,
          foundItem: null,
          newBalance: Math.max(0, user.coins - punishment),
          message: `${randomMessage} Lost ${punishment} coins as punishment!`,
        };
      }
    }

    // Normal search for other locations
    const amount =
      searchLocation.coins.min +
      Math.floor(
        Math.random() *
          (searchLocation.coins.max - searchLocation.coins.min + 1),
      );

    // Dynamic chance for item based on location
    let foundItem = null;
    if (Math.random() < searchLocation.itemChance) {
      const items = await storage.getAllItems();
      const commonItems = items.filter((item) => item.rarity === "common");
      if (commonItems.length > 0) {
        foundItem = commonItems[Math.floor(Math.random() * commonItems.length)];
      }
    }

    const updates: any = {
      coins: user.coins + amount,
      xp: user.xp + 2,
      lastSearch: new Date(now),
    };

    if (foundItem) {
      const existingItem = user.inventory.find(
        (item) => item.itemId === foundItem.id,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        user.inventory.push({
          itemId: foundItem.id,
          quantity: 1,
          equipped: false,
        });
      }
      updates.inventory = user.inventory;
    }

    await storage.updateUser(user.id, updates);

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount,
      targetUser: null,
      description: `Searched ${locationName}: ${amount} coins${foundItem ? ` + ${foundItem.name}` : ""}`,
    });

    return {
      success: true,
      location: locationName,
      coins: amount,
      foundItem,
      newBalance: user.coins + amount,
      message: `You searched ${locationName} and found ${amount} coins!${foundItem ? ` You also found a ${foundItem.name}!` : ""}`,
    };
  }

  // Calculate and apply bank interest
  static async applyBankInterest(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user || user.bank <= 0) return;

    const daysSinceLastActive =
      (Date.now() - user.lastActive.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceLastActive < 1) return; // Must be at least 1 day

    const dailyRate = 0.005; // 0.5% daily
    const daysToApply = Math.min(7, Math.floor(daysSinceLastActive)); // Max 7 days
    const interest = Math.floor(user.bank * dailyRate * daysToApply);

    if (interest > 0) {
      await storage.updateUser(user.id, {
        bank: user.bank + interest,
      });

      await storage.createTransaction({
        user: username,
        type: "earn",
        amount: interest,
        targetUser: null,
        description: `Bank interest: ${daysToApply} day(s) at 0.5% daily`,
      });
    }

    return interest;
  }

  // Fishing system
  static async fish(username: string, location?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Check if user has Fishing Rod
    const allItems = await storage.getAllItems();
    const fishingRod = allItems.find((item) => item.name === "Fishing Rod");
    if (fishingRod) {
      const hasFishingRod = user.inventory.some(
        (item) => item.itemId === fishingRod.id,
      );
      if (!hasFishingRod) {
        throw new Error(
          "You need a Fishing Rod to fish! Buy one from the shop.",
        );
      }
    }

    const now = Date.now();
    const fishCooldown = 10 * 1000; // 10 seconds

    if (user.lastFish && now - user.lastFish.getTime() < fishCooldown) {
      const remaining = fishCooldown - (now - user.lastFish.getTime());
      throw new Error(
        `Fishing cooldown: ${Math.ceil(remaining / 60000)} minutes remaining`,
      );
    }

    // 20% failure chance
    const fishingFailed = Math.random() < 0.2;

    if (fishingFailed) {
      const failureMessages = [
        "The fish laughed at your technique! 😂",
        "You caught a boot instead! 👢",
        "The fish stole your bait! 🐟💨",
        "You fell in the water! 💦",
        "The fish outsmarted you! 🧠🐟",
      ];

      await storage.updateUser(user.id, {
        lastFish: new Date(now),
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        fish: null,
        newBalance: user.coins,
        newXP: user.xp,
        message: `${randomMessage} No catch this time!`,
      };
    }

    // Randomly select a fish from the 100+ options
    const caughtFish = this.FISH_OPTIONS[Math.floor(Math.random() * this.FISH_OPTIONS.length)];

    const successMessages = [
      "The fish didn't stand a chance! 🐟",
      "You're basically Aquaman now! 🔱",
      "Fish fear you! 😱",
      "Master angler! 🎣✨",
      "Reel deal champion! 🏆",
    ];

    await storage.updateUser(user.id, {
      coins: user.coins + caughtFish.coins,
      xp: user.xp + caughtFish.xp,
      lastFish: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "fish",
      amount: caughtFish.coins,
      targetUser: null,
      description: `Caught a ${caughtFish.name}: ${caughtFish.coins} coins, ${caughtFish.xp} XP`,
    });

    const randomMessage =
      successMessages[Math.floor(Math.random() * successMessages.length)];

    return {
      success: true,
      fish: caughtFish,
      newBalance: user.coins + caughtFish.coins,
      newXP: user.xp + caughtFish.xp,
      message: `${randomMessage} Caught a ${caughtFish.name}! +${caughtFish.coins} coins!`,
    };
  }

  // Mining system
  static async mine(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const mineCooldown = 10 * 1000; // 10 seconds

    if (user.lastMine && now - user.lastMine.getTime() < mineCooldown) {
      const remaining = mineCooldown - (now - user.lastMine.getTime());
      throw new Error(
        `Mining cooldown: ${Math.ceil(remaining / 60000)} minutes remaining`,
      );
    }

    const ores = [
      { name: "Coal", coins: 80, chance: 0.5, xp: 6 },
      { name: "Iron", coins: 150, chance: 0.25, xp: 12 },
      { name: "Gold", coins: 300, chance: 0.15, xp: 20 },
      { name: "Diamond", coins: 800, chance: 0.08, xp: 40 },
      { name: "Mithril", coins: 1500, chance: 0.02, xp: 80 },
    ];

    const rand = Math.random();
    let cumulativeChance = 0;
    let minedOre = ores[0];

    for (const ore of [...ores].reverse()) {
      cumulativeChance += ore.chance;
      if (rand <= cumulativeChance) {
        minedOre = ore;
        break;
      }
    }

    await storage.updateUser(user.id, {
      coins: user.coins + minedOre.coins,
      xp: user.xp + minedOre.xp,
      lastMine: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "mine",
      amount: minedOre.coins,
      targetUser: null,
      description: `Mined ${minedOre.name}: ${minedOre.coins} coins, ${minedOre.xp} XP`,
    });

    return {
      success: true,
      ore: minedOre,
      newBalance: user.coins + minedOre.coins,
      newXP: user.xp + minedOre.xp,
      message: `You mined ${minedOre.name} and earned ${minedOre.coins} coins! ⛏️`,
    };
  }

  // Vote/Survey system
  static async vote(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const voteCooldown = 10 * 1000; // 10 seconds

    if (user.lastVote && now - user.lastVote.getTime() < voteCooldown) {
      const remaining = voteCooldown - (now - user.lastVote.getTime());
      throw new Error(
        `Vote cooldown: ${Math.ceil(remaining / 3600000)} hours remaining`,
      );
    }

    const rewards = [250, 300, 350, 400, 450, 500];
    const amount = rewards[Math.floor(Math.random() * rewards.length)];
    const xpGain = 15;

    await storage.updateUser(user.id, {
      coins: user.coins + amount,
      xp: user.xp + xpGain,
      lastVote: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "vote",
      amount,
      targetUser: null,
      description: `Community vote reward: ${amount} coins, ${xpGain} XP`,
    });

    return {
      success: true,
      coins: amount,
      xp: xpGain,
      newBalance: user.coins + amount,
      newXP: user.xp + xpGain,
      message: `Thanks for voting! You earned ${amount} coins! 🗳️`,
    };
  }

  // Adventure system
  static async adventure(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const adventureCooldown = 10 * 1000; // 10 seconds

    if (
      user.lastAdventure &&
      now - user.lastAdventure.getTime() < adventureCooldown
    ) {
      const remaining =
        adventureCooldown - (now - user.lastAdventure.getTime());
      throw new Error(
        `Adventure cooldown: ${Math.ceil(remaining / 3600000)} hours remaining`,
      );
    }

    const adventures = [
      { name: "Forest Quest", coins: 300, xp: 25, success: 0.8 },
      { name: "Mountain Expedition", coins: 500, xp: 40, success: 0.6 },
      { name: "Dungeon Raid", coins: 800, xp: 60, success: 0.4 },
      { name: "Dragon Hunt", coins: 1200, xp: 100, success: 0.25 },
    ];

    const adventure = adventures[Math.floor(Math.random() * adventures.length)];
    const success = Math.random() < adventure.success;

    if (success) {
      await storage.updateUser(user.id, {
        coins: user.coins + adventure.coins,
        xp: user.xp + adventure.xp,
        lastAdventure: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "adventure",
        amount: adventure.coins,
        targetUser: null,
        description: `${adventure.name} completed: ${adventure.coins} coins, ${adventure.xp} XP`,
      });

      return {
        success: true,
        adventure: adventure.name,
        coins: adventure.coins,
        xp: adventure.xp,
        newBalance: user.coins + adventure.coins,
        newXP: user.xp + adventure.xp,
        message: `${adventure.name} successful! Earned ${adventure.coins} coins! 🗺️`,
      };
    } else {
      await storage.updateUser(user.id, {
        lastAdventure: new Date(now),
      });

      const failMessages = [
        "Your adventure failed, but you gained experience from the journey!",
        "The quest was too dangerous, you barely escaped!",
        "Better luck next time, adventurer!",
      ];

      return {
        success: false,
        adventure: adventure.name,
        coins: 0,
        newBalance: user.coins,
        message: failMessages[Math.floor(Math.random() * failMessages.length)],
      };
    }
  }

  // Achievement system
  static async checkAchievements(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) return [];

    const newAchievements = [];
    const currentAchievements = user.achievements || [];

    const achievementDefinitions = [
      // Beginner Achievements
      {
        id: "first_coin",
        name: "First Coin",
        description: "Earn your first coin",
        coins: 100,
        requirement: () => user.coins > 0,
      },
      {
        id: "first_work",
        name: "First Day on the Job",
        description: "Complete your first work shift",
        coins: 50,
        requirement: () => (user.gameStats?.workCount || 0) >= 1,
      },
      {
        id: "first_bank",
        name: "Saving Up",
        description: "Deposit coins in the bank for the first time",
        coins: 75,
        requirement: () => user.bank > 0,
      },
      
      // Level Achievements
      {
        id: "level_5",
        name: "Level Up!",
        description: "Reach level 5",
        coins: 500,
        requirement: () => user.level >= 5,
      },
      {
        id: "level_10",
        name: "Experienced",
        description: "Reach level 10",
        coins: 1000,
        requirement: () => user.level >= 10,
      },
      {
        id: "level_15",
        name: "Veteran Player",
        description: "Reach level 15",
        coins: 2000,
        requirement: () => user.level >= 15,
      },
      {
        id: "level_20",
        name: "Master",
        description: "Reach level 20",
        coins: 3500,
        requirement: () => user.level >= 20,
      },
      {
        id: "level_25",
        name: "Elite",
        description: "Reach level 25",
        coins: 5000,
        requirement: () => user.level >= 25,
      },
      {
        id: "level_30",
        name: "Champion",
        description: "Reach level 30",
        coins: 7500,
        requirement: () => user.level >= 30,
      },
      {
        id: "level_50",
        name: "Legend",
        description: "Reach level 50",
        coins: 15000,
        requirement: () => user.level >= 50,
      },
      
      // Economy Achievements
      {
        id: "rich_1k",
        name: "Getting Rich",
        description: "Have 1,000 coins",
        coins: 250,
        requirement: () => user.coins >= 1000,
      },
      {
        id: "rich_10k",
        name: "Very Rich",
        description: "Have 10,000 coins",
        coins: 1000,
        requirement: () => user.coins >= 10000,
      },
      {
        id: "rich_50k",
        name: "Wealthy",
        description: "Have 50,000 coins",
        coins: 5000,
        requirement: () => user.coins >= 50000,
      },
      {
        id: "rich_100k",
        name: "Six Figures",
        description: "Have 100,000 coins",
        coins: 10000,
        requirement: () => user.coins >= 100000,
      },
      {
        id: "rich_500k",
        name: "Half a Million",
        description: "Have 500,000 coins",
        coins: 25000,
        requirement: () => user.coins >= 500000,
      },
      {
        id: "millionaire",
        name: "Millionaire",
        description: "Have 1,000,000 coins",
        coins: 50000,
        requirement: () => user.coins >= 1000000,
      },
      {
        id: "multi_millionaire",
        name: "Multi-Millionaire",
        description: "Have 5,000,000 coins",
        coins: 100000,
        requirement: () => user.coins >= 5000000,
      },
      
      // Bank Achievements
      {
        id: "bank_10k",
        name: "Safe Keeper",
        description: "Have 10,000 coins in the bank",
        coins: 1500,
        requirement: () => user.bank >= 10000,
      },
      {
        id: "bank_100k",
        name: "Bank Vault",
        description: "Have 100,000 coins in the bank",
        coins: 10000,
        requirement: () => user.bank >= 100000,
      },
      {
        id: "bank_500k",
        name: "Secure Fortune",
        description: "Have 500,000 coins in the bank",
        coins: 30000,
        requirement: () => user.bank >= 500000,
      },
      
      // Work Achievements
      {
        id: "worker",
        name: "Hard Worker",
        description: "Work 10 times",
        coins: 300,
        requirement: () => (user.gameStats?.workCount || 0) >= 10,
      },
      {
        id: "worker_50",
        name: "Dedicated Worker",
        description: "Work 50 times",
        coins: 1500,
        requirement: () => (user.gameStats?.workCount || 0) >= 50,
      },
      {
        id: "worker_100",
        name: "Workaholic",
        description: "Work 100 times",
        coins: 3000,
        requirement: () => (user.gameStats?.workCount || 0) >= 100,
      },
      {
        id: "worker_500",
        name: "Career Professional",
        description: "Work 500 times",
        coins: 10000,
        requirement: () => (user.gameStats?.workCount || 0) >= 500,
      },
      
      // Crime Achievements
      {
        id: "first_crime",
        name: "Breaking Bad",
        description: "Commit your first crime",
        coins: 100,
        requirement: () => (user.gameStats?.crimeCount || 0) >= 1,
      },
      {
        id: "criminal_10",
        name: "Petty Criminal",
        description: "Commit 10 crimes",
        coins: 500,
        requirement: () => (user.gameStats?.crimeCount || 0) >= 10,
      },
      {
        id: "criminal_50",
        name: "Career Criminal",
        description: "Commit 50 crimes",
        coins: 2000,
        requirement: () => (user.gameStats?.crimeCount || 0) >= 50,
      },
      {
        id: "criminal_100",
        name: "Crime Lord",
        description: "Commit 100 crimes",
        coins: 5000,
        requirement: () => (user.gameStats?.crimeCount || 0) >= 100,
      },
      
      // Gambling Achievements
      {
        id: "first_gamble",
        name: "Feeling Lucky",
        description: "Gamble for the first time",
        coins: 100,
        requirement: () => (user.gameStats?.gambleCount || 0) >= 1,
      },
      {
        id: "gambler_25",
        name: "Frequent Gambler",
        description: "Gamble 25 times",
        coins: 1000,
        requirement: () => (user.gameStats?.gambleCount || 0) >= 25,
      },
      {
        id: "gambler_100",
        name: "High Roller",
        description: "Gamble 100 times",
        coins: 5000,
        requirement: () => (user.gameStats?.gambleCount || 0) >= 100,
      },
      
      // Shopping Achievements
      {
        id: "first_purchase",
        name: "First Purchase",
        description: "Buy your first item from the shop",
        coins: 150,
        requirement: () => (user.inventory && Object.keys(user.inventory).length > 0),
      },
      {
        id: "shopaholic_10",
        name: "Shopaholic",
        description: "Own 10 different items",
        coins: 1000,
        requirement: () => (user.inventory && Object.keys(user.inventory).length >= 10),
      },
      {
        id: "collector_25",
        name: "Collector",
        description: "Own 25 different items",
        coins: 3000,
        requirement: () => (user.inventory && Object.keys(user.inventory).length >= 25),
      },
      {
        id: "hoarder_50",
        name: "Hoarder",
        description: "Own 50 different items",
        coins: 7500,
        requirement: () => (user.inventory && Object.keys(user.inventory).length >= 50),
      },
      
      // Social Achievements
      {
        id: "first_friend",
        name: "Making Friends",
        description: "Add your first friend",
        coins: 200,
        requirement: () => (user.friends && user.friends.length >= 1),
      },
      {
        id: "social_5",
        name: "Social Butterfly",
        description: "Have 5 friends",
        coins: 750,
        requirement: () => (user.friends && user.friends.length >= 5),
      },
      {
        id: "social_10",
        name: "Popular",
        description: "Have 10 friends",
        coins: 2000,
        requirement: () => (user.friends && user.friends.length >= 10),
      },
      
      // Pet Achievements
      {
        id: "first_pet",
        name: "Pet Owner",
        description: "Adopt your first pet",
        coins: 500,
        requirement: () => (user.gameStats?.petCount || 0) >= 1,
      },
      {
        id: "pet_lover_3",
        name: "Pet Lover",
        description: "Own 3 pets",
        coins: 1500,
        requirement: () => (user.gameStats?.petCount || 0) >= 3,
      },
      {
        id: "pet_collector_5",
        name: "Pet Collector",
        description: "Own 5 pets",
        coins: 3000,
        requirement: () => (user.gameStats?.petCount || 0) >= 5,
      },
      
      // Adventure Achievements
      {
        id: "first_adventure",
        name: "Adventurer",
        description: "Complete your first adventure",
        coins: 300,
        requirement: () => (user.gameStats?.adventureCount || 0) >= 1,
      },
      {
        id: "explorer_10",
        name: "Explorer",
        description: "Complete 10 adventures",
        coins: 2000,
        requirement: () => (user.gameStats?.adventureCount || 0) >= 10,
      },
      {
        id: "treasure_hunter_50",
        name: "Treasure Hunter",
        description: "Complete 50 adventures",
        coins: 7500,
        requirement: () => (user.gameStats?.adventureCount || 0) >= 50,
      },
      
      // Daily Achievements
      {
        id: "daily_5",
        name: "Consistent Player",
        description: "Claim daily reward 5 times",
        coins: 500,
        requirement: () => (user.gameStats?.dailyCount || 0) >= 5,
      },
      {
        id: "daily_30",
        name: "Monthly Dedication",
        description: "Claim daily reward 30 times",
        coins: 3000,
        requirement: () => (user.gameStats?.dailyCount || 0) >= 30,
      },
      {
        id: "daily_100",
        name: "Daily Champion",
        description: "Claim daily reward 100 times",
        coins: 10000,
        requirement: () => (user.gameStats?.dailyCount || 0) >= 100,
      },
      
      // Special Achievements
      {
        id: "lucky_7",
        name: "Lucky Number Seven",
        description: "Reach exactly 7,777 coins",
        coins: 777,
        requirement: () => user.coins === 7777,
      },
      {
        id: "broke",
        name: "Rock Bottom",
        description: "Have exactly 0 coins after having more than 1000",
        coins: 500,
        requirement: () => user.coins === 0 && (user.gameStats?.maxCoins || 0) > 1000,
      },
      {
        id: "comeback_kid",
        name: "Comeback Kid",
        description: "Earn 10,000 coins after going broke",
        coins: 2000,
        requirement: () => user.coins >= 10000 && (user.gameStats?.timesBroke || 0) >= 1,
      },
      {
        id: "profile_complete",
        name: "Profile Perfectionist",
        description: "Complete your profile with bio and avatar",
        coins: 500,
        requirement: () => user.bio && user.bio.length > 10 && user.avatarUrl && user.avatarUrl.length > 0,
      },
      
      // Admin/Special Badges (manually granted)
      {
        id: "owners",
        name: "Owner",
        description: "Special protection badge for owners",
        coins: 0,
        requirement: () => false,
      },
      {
        id: "badge_junior_admin",
        name: "Junior Admin",
        description: "Junior Administrator badge",
        coins: 0,
        requirement: () => false,
      },
      {
        id: "badge_admin",
        name: "Admin",
        description: "Administrator badge",
        coins: 0,
        requirement: () => false,
      },
      {
        id: "badge_senior_admin",
        name: "Senior Admin",
        description: "Senior Administrator badge",
        coins: 0,
        requirement: () => false,
      },
      {
        id: "badge_lead_admin",
        name: "Lead Admin",
        description: "Lead Administrator badge",
        coins: 0,
        requirement: () => false,
      },
    ];

    for (const achievement of achievementDefinitions) {
      if (
        !currentAchievements.includes(achievement.id) &&
        achievement.requirement()
      ) {
        newAchievements.push(achievement);
        currentAchievements.push(achievement.id);

        await storage.updateUser(user.id, {
          coins: user.coins + achievement.coins,
          achievements: currentAchievements,
        });

        await storage.createTransaction({
          user: username,
          type: "earn",
          amount: achievement.coins,
          targetUser: null,
          description: `Achievement unlocked: ${achievement.name} - ${achievement.coins} coins`,
        });
      }
    }

    return newAchievements;
  }

  // Get all achievement definitions
  static getAllAchievements() {
    return [
      // Beginner Achievements
      {
        id: "first_coin",
        name: "First Coin",
        description: "Earn your first coin",
        coins: 100,
      },
      {
        id: "first_work",
        name: "First Day on the Job",
        description: "Complete your first work shift",
        coins: 50,
      },
      {
        id: "first_bank",
        name: "Saving Up",
        description: "Deposit coins in the bank for the first time",
        coins: 75,
      },
      
      // Level Achievements
      {
        id: "level_5",
        name: "Level Up!",
        description: "Reach level 5",
        coins: 500,
      },
      {
        id: "level_10",
        name: "Experienced",
        description: "Reach level 10",
        coins: 1000,
      },
      {
        id: "level_15",
        name: "Veteran Player",
        description: "Reach level 15",
        coins: 2000,
      },
      {
        id: "level_20",
        name: "Master",
        description: "Reach level 20",
        coins: 3500,
      },
      {
        id: "level_25",
        name: "Elite",
        description: "Reach level 25",
        coins: 5000,
      },
      {
        id: "level_30",
        name: "Champion",
        description: "Reach level 30",
        coins: 7500,
      },
      {
        id: "level_50",
        name: "Legend",
        description: "Reach level 50",
        coins: 15000,
      },
      
      // Economy Achievements
      {
        id: "rich_1k",
        name: "Getting Rich",
        description: "Have 1,000 coins",
        coins: 250,
      },
      {
        id: "rich_10k",
        name: "Very Rich",
        description: "Have 10,000 coins",
        coins: 1000,
      },
      {
        id: "rich_50k",
        name: "Wealthy",
        description: "Have 50,000 coins",
        coins: 5000,
      },
      {
        id: "rich_100k",
        name: "Six Figures",
        description: "Have 100,000 coins",
        coins: 10000,
      },
      {
        id: "rich_500k",
        name: "Half a Million",
        description: "Have 500,000 coins",
        coins: 25000,
      },
      {
        id: "millionaire",
        name: "Millionaire",
        description: "Have 1,000,000 coins",
        coins: 50000,
      },
      {
        id: "multi_millionaire",
        name: "Multi-Millionaire",
        description: "Have 5,000,000 coins",
        coins: 100000,
      },
      
      // Bank Achievements
      {
        id: "bank_10k",
        name: "Safe Keeper",
        description: "Have 10,000 coins in the bank",
        coins: 1500,
      },
      {
        id: "bank_100k",
        name: "Bank Vault",
        description: "Have 100,000 coins in the bank",
        coins: 10000,
      },
      {
        id: "bank_500k",
        name: "Secure Fortune",
        description: "Have 500,000 coins in the bank",
        coins: 30000,
      },
      
      // Work Achievements
      {
        id: "worker",
        name: "Hard Worker",
        description: "Work 10 times",
        coins: 300,
      },
      {
        id: "worker_50",
        name: "Dedicated Worker",
        description: "Work 50 times",
        coins: 1500,
      },
      {
        id: "worker_100",
        name: "Workaholic",
        description: "Work 100 times",
        coins: 3000,
      },
      {
        id: "worker_500",
        name: "Career Professional",
        description: "Work 500 times",
        coins: 10000,
      },
      
      // Crime Achievements
      {
        id: "first_crime",
        name: "Breaking Bad",
        description: "Commit your first crime",
        coins: 100,
      },
      {
        id: "criminal_10",
        name: "Petty Criminal",
        description: "Commit 10 crimes",
        coins: 500,
      },
      {
        id: "criminal_50",
        name: "Career Criminal",
        description: "Commit 50 crimes",
        coins: 2000,
      },
      {
        id: "criminal_100",
        name: "Crime Lord",
        description: "Commit 100 crimes",
        coins: 5000,
      },
      
      // Gambling Achievements
      {
        id: "first_gamble",
        name: "Feeling Lucky",
        description: "Gamble for the first time",
        coins: 100,
      },
      {
        id: "gambler_25",
        name: "Frequent Gambler",
        description: "Gamble 25 times",
        coins: 1000,
      },
      {
        id: "gambler_100",
        name: "High Roller",
        description: "Gamble 100 times",
        coins: 5000,
      },
      
      // Shopping Achievements
      {
        id: "first_purchase",
        name: "First Purchase",
        description: "Buy your first item from the shop",
        coins: 150,
      },
      {
        id: "shopaholic_10",
        name: "Shopaholic",
        description: "Own 10 different items",
        coins: 1000,
      },
      {
        id: "collector_25",
        name: "Collector",
        description: "Own 25 different items",
        coins: 3000,
      },
      {
        id: "hoarder_50",
        name: "Hoarder",
        description: "Own 50 different items",
        coins: 7500,
      },
      
      // Social Achievements
      {
        id: "first_friend",
        name: "Making Friends",
        description: "Add your first friend",
        coins: 200,
      },
      {
        id: "social_5",
        name: "Social Butterfly",
        description: "Have 5 friends",
        coins: 750,
      },
      {
        id: "social_10",
        name: "Popular",
        description: "Have 10 friends",
        coins: 2000,
      },
      
      // Pet Achievements
      {
        id: "first_pet",
        name: "Pet Owner",
        description: "Adopt your first pet",
        coins: 500,
      },
      {
        id: "pet_lover_3",
        name: "Pet Lover",
        description: "Own 3 pets",
        coins: 1500,
      },
      {
        id: "pet_collector_5",
        name: "Pet Collector",
        description: "Own 5 pets",
        coins: 3000,
      },
      
      // Adventure Achievements
      {
        id: "first_adventure",
        name: "Adventurer",
        description: "Complete your first adventure",
        coins: 300,
      },
      {
        id: "explorer_10",
        name: "Explorer",
        description: "Complete 10 adventures",
        coins: 2000,
      },
      {
        id: "treasure_hunter_50",
        name: "Treasure Hunter",
        description: "Complete 50 adventures",
        coins: 7500,
      },
      
      // Daily Achievements
      {
        id: "daily_5",
        name: "Consistent Player",
        description: "Claim daily reward 5 times",
        coins: 500,
      },
      {
        id: "daily_30",
        name: "Monthly Dedication",
        description: "Claim daily reward 30 times",
        coins: 3000,
      },
      {
        id: "daily_100",
        name: "Daily Champion",
        description: "Claim daily reward 100 times",
        coins: 10000,
      },
      
      // Special Achievements
      {
        id: "lucky_7",
        name: "Lucky Number Seven",
        description: "Reach exactly 7,777 coins",
        coins: 777,
      },
      {
        id: "broke",
        name: "Rock Bottom",
        description: "Have exactly 0 coins after having more than 1000",
        coins: 500,
      },
      {
        id: "comeback_kid",
        name: "Comeback Kid",
        description: "Earn 10,000 coins after going broke",
        coins: 2000,
      },
      {
        id: "profile_complete",
        name: "Profile Perfectionist",
        description: "Complete your profile with bio and avatar",
        coins: 500,
      },
      
      // Admin/Special Badges (manually granted)
      {
        id: "owners",
        name: "Owner",
        description: "Special protection badge for owners",
        coins: 0,
      },
      {
        id: "badge_junior_admin",
        name: "Junior Admin",
        description: "Junior Administrator badge",
        coins: 0,
      },
      {
        id: "badge_admin",
        name: "Admin",
        description: "Administrator badge",
        coins: 0,
      },
      {
        id: "badge_senior_admin",
        name: "Senior Admin",
        description: "Senior Administrator badge",
        coins: 0,
      },
      {
        id: "badge_lead_admin",
        name: "Lead Admin",
        description: "Lead Administrator badge",
        coins: 0,
      },
    ];
  }

  // Get achievement details by ID
  static getAchievementById(achievementId: string) {
    const achievements = this.getAllAchievements();
    return achievements.find(ach => ach.id === achievementId);
  }

  // Check if user has owners badge (protection from bans/coin removal)
  static async hasOwnersBadge(username: string): Promise<boolean> {
    const user = await storage.getUserByUsername(username);
    if (!user) return false;

    const achievements = user.achievements || [];
    return achievements.includes("owners");
  }

  // Manually grant owners badge to a user (admin only function)
  static async grantOwnersBadge(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const currentAchievements = user.achievements || [];
    if (!currentAchievements.includes("owners")) {
      currentAchievements.push("owners");
      await storage.updateUser(user.id, {
        achievements: currentAchievements,
      });
    }
    return true;
  }

  // Manually remove owners badge from a user (admin only function)
  static async removeOwnersBadge(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const currentAchievements = user.achievements || [];
    const updatedAchievements = currentAchievements.filter(
      (achievement) => achievement !== "owners"
    );
    
    if (currentAchievements.length !== updatedAchievements.length) {
      await storage.updateUser(user.id, {
        achievements: updatedAchievements,
      });
    }
    return true;
  }

  // Check if user has specific admin role badge
  static async hasAdminRoleBadge(
    username: string,
    adminRole: string,
  ): Promise<boolean> {
    const user = await storage.getUserByUsername(username);
    if (!user) return false;

    const achievements = user.achievements || [];
    return achievements.includes(`badge_${adminRole}`);
  }

  // Grant admin badge for specific role
  static async grantAdminRoleBadge(username: string, adminRole: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const badgeId = `badge_${adminRole}`;
    const currentAchievements = user.achievements || [];
    if (!currentAchievements.includes(badgeId)) {
      currentAchievements.push(badgeId);
      await storage.updateUser(user.id, {
        achievements: currentAchievements,
      });
    }
    return true;
  }

  // Grant Junior Admin badge
  static async grantJuniorAdminBadge(username: string) {
    return this.grantAdminRoleBadge(username, "junior_admin");
  }

  // Grant Admin badge
  static async grantAdminBadge(username: string) {
    return this.grantAdminRoleBadge(username, "admin");
  }

  // Grant Senior Admin badge
  static async grantSeniorAdminBadge(username: string) {
    return this.grantAdminRoleBadge(username, "senior_admin");
  }

  // Grant Lead Admin badge
  static async grantLeadAdminBadge(username: string) {
    return this.grantAdminRoleBadge(username, "lead_admin");
  }

  // Check if user has Junior Admin badge
  static async hasJuniorAdminBadge(username: string): Promise<boolean> {
    return this.hasAdminRoleBadge(username, "junior_admin");
  }

  // Check if user has Admin badge
  static async hasSpecificAdminBadge(username: string): Promise<boolean> {
    return this.hasAdminRoleBadge(username, "admin");
  }

  // Check if user has Senior Admin badge
  static async hasSeniorAdminBadge(username: string): Promise<boolean> {
    return this.hasAdminRoleBadge(username, "senior_admin");
  }

  // Check if user has Lead Admin badge
  static async hasLeadAdminBadge(username: string): Promise<boolean> {
    return this.hasAdminRoleBadge(username, "lead_admin");
  }

  // Crime system
  static async crime(username: string, crimeType?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const crimeCooldown = 10 * 1000; // 10 seconds

    if (user.lastCrime && now - user.lastCrime.getTime() < crimeCooldown) {
      const remaining = crimeCooldown - (now - user.lastCrime.getTime());
      throw new Error(
        `Crime cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    // Randomly select a crime from the 100+ options
    const selectedCrime = this.CRIME_OPTIONS[Math.floor(Math.random() * this.CRIME_OPTIONS.length)];
    const success = Math.random() < selectedCrime.success;

    if (success) {
      await storage.updateUser(user.id, {
        coins: user.coins + selectedCrime.coins,
        xp: user.xp + selectedCrime.xp,
        lastCrime: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "crime",
        amount: selectedCrime.coins,
        targetUser: null,
        description: `Crime "${selectedCrime.name}" successful: ${selectedCrime.coins} coins, ${selectedCrime.xp} XP`,
      });

      return {
        success: true,
        crime: selectedCrime.name,
        coins: selectedCrime.coins,
        xp: selectedCrime.xp,
        newBalance: user.coins + selectedCrime.coins,
        message: `Crime successful! ${selectedCrime.name} earned you ${selectedCrime.coins} coins! 🦹`,
      };
    } else {
      const totalLoss = Math.min(user.coins, selectedCrime.fine);

      await storage.updateUser(user.id, {
        coins: user.coins - totalLoss,
        lastCrime: new Date(now),
      });

      await storage.createTransaction({
        user: username,
        type: "fine",
        amount: totalLoss,
        targetUser: null,
        description: `Crime "${selectedCrime.name}" failed - fined ${totalLoss} coins`,
      });

      return {
        success: false,
        crime: selectedCrime.name,
        fine: totalLoss,
        newBalance: user.coins - totalLoss,
        message: `Crime failed! You were caught and fined ${totalLoss} coins! 🚔`,
      };
    }
  }

  // Hunt system
  static async hunt(username: string, huntType?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Check if user has Hunting Rifle
    const allItems = await storage.getAllItems();
    const huntingRifle = allItems.find((item) => item.name === "Hunting Rifle");
    if (huntingRifle) {
      const hasHuntingRifle = user.inventory.some(
        (item) => item.itemId === huntingRifle.id,
      );
      if (!hasHuntingRifle) {
        throw new Error(
          "You need a Hunting Rifle to hunt! Buy one from the shop.",
        );
      }
    }

    const now = Date.now();
    const huntCooldown = 10 * 1000; // 10 seconds

    if (user.lastHunt && now - user.lastHunt.getTime() < huntCooldown) {
      const remaining = huntCooldown - (now - user.lastHunt.getTime());
      throw new Error(
        `Hunt cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    const huntingAreas = {
      forest: [
        { name: "Rabbit", coins: 50, chance: 0.5, xp: 5 },
        { name: "Duck", coins: 100, chance: 0.3, xp: 8 },
        { name: "Boar", coins: 200, chance: 0.2, xp: 12 },
      ],
      mountains: [
        { name: "Duck", coins: 100, chance: 0.4, xp: 8 },
        { name: "Boar", coins: 200, chance: 0.35, xp: 12 },
        { name: "Bear", coins: 400, chance: 0.25, xp: 20 },
      ],
      "dragons-lair": [
        { name: "Bear", coins: 400, chance: 0.87, xp: 20 },
        { name: "Dragon", coins: 1000, chance: 0.08, xp: 40 },
        { name: "Kraken", coins: 2000, chance: 0.05, xp: 60 },
      ],
    };

    const selectedArea = huntType || "forest";
    const animals =
      huntingAreas[selectedArea as keyof typeof huntingAreas] ||
      huntingAreas.forest;

    // 15% failure chance
    const huntingFailed = Math.random() < 0.15;

    if (huntingFailed) {
      const failureMessages = [
        "The deer kicked you in the face! 🦌💥",
        "You scared yourself more than the animal! 😱",
        "Your gun jammed! Classic! 🔫",
        "The animal laughed and ran away! 🏃💨",
        "You tripped on a tree root! 🌳💥",
      ];

      await storage.updateUser(user.id, {
        lastHunt: new Date(now),
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        animal: null,
        newBalance: user.coins,
        newXP: user.xp,
        message: `${randomMessage} No catch today!`,
      };
    }

    const rand = Math.random();
    let cumulativeChance = 0;
    let caughtAnimal = animals[0];

    for (const animal of [...animals].reverse()) {
      cumulativeChance += animal.chance;
      if (rand <= cumulativeChance) {
        caughtAnimal = animal;
        break;
      }
    }

    const successMessages = [
      "You're the next Steve Irwin! 🐊",
      "The animal surrendered peacefully! 🏳️",
      "Bullseye! Perfect shot! 🎯",
      "Nature fears you! 🌲😱",
      "Legendary hunter! 🏹✨",
    ];

    await storage.updateUser(user.id, {
      coins: user.coins + caughtAnimal.coins,
      xp: user.xp + caughtAnimal.xp,
      lastHunt: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount: caughtAnimal.coins,
      targetUser: null,
      description: `Hunted a ${caughtAnimal.name}: ${caughtAnimal.coins} coins, ${caughtAnimal.xp} XP`,
    });

    const randomMessage =
      successMessages[Math.floor(Math.random() * successMessages.length)];

    return {
      success: true,
      animal: caughtAnimal,
      newBalance: user.coins + caughtAnimal.coins,
      newXP: user.xp + caughtAnimal.xp,
      message: `${randomMessage} Hunted a ${caughtAnimal.name}! +${caughtAnimal.coins} coins!`,
    };
  }

  // Dig system
  static async dig(username: string, location?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Check if user has Shovel
    const allItems = await storage.getAllItems();
    const shovel = allItems.find((item) => item.name === "Shovel");
    if (shovel) {
      const hasShovel = user.inventory.some(
        (item) => item.itemId === shovel.id,
      );
      if (!hasShovel) {
        throw new Error("You need a Shovel to dig! Buy one from the shop.");
      }
    }

    const now = Date.now();
    const digCooldown = 10 * 1000; // 10 seconds

    if (user.lastDig && now - user.lastDig.getTime() < digCooldown) {
      const remaining = digCooldown - (now - user.lastDig.getTime());
      throw new Error(
        `Dig cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    // 20% failure chance
    const diggingFailed = Math.random() < 0.2;

    if (diggingFailed) {
      const failureMessages = [
        "You dug a hole to nowhere! 🕳️",
        "A mole bit your finger! 🐭😠",
        "Your shovel broke! 🔨💥",
        "You found... dirt. Just dirt. 😑",
        "Hit a rock and hurt your back! 💥🪨",
      ];

      await storage.updateUser(user.id, {
        lastDig: new Date(now),
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        treasure: null,
        newBalance: user.coins,
        newXP: user.xp,
        message: `${randomMessage} Better luck next time!`,
      };
    }

    // Randomly select a treasure from the 100+ options
    const foundTreasure = this.DIG_OPTIONS[Math.floor(Math.random() * this.DIG_OPTIONS.length)];

    const successMessages = [
      "You struck gold! Well, coins... but still! ⛏️✨",
      "Your back hurts but it was worth it! 💪",
      "Jackpot underground! 💎",
      "You're a digging machine! 🤖",
      "Treasure hunter extraordinaire! 🏆",
    ];

    await storage.updateUser(user.id, {
      coins: user.coins + foundTreasure.coins,
      xp: user.xp + foundTreasure.xp,
      lastDig: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "earn",
      amount: foundTreasure.coins,
      targetUser: null,
      description: `Dug up a ${foundTreasure.name}: ${foundTreasure.coins} coins, ${foundTreasure.xp} XP`,
    });

    const randomMessage =
      successMessages[Math.floor(Math.random() * successMessages.length)];

    return {
      success: true,
      treasure: foundTreasure,
      newBalance: user.coins + foundTreasure.coins,
      newXP: user.xp + foundTreasure.xp,
      message: `${randomMessage} Dug up a ${foundTreasure.name}! +${foundTreasure.coins} coins!`,
    };
  }

  // Post meme system
  static async postmeme(username: string, memeType?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Check if user has Phone
    const allItems = await storage.getAllItems();
    const phone = allItems.find((item) =>
      item.name.toLowerCase().includes("phone"),
    );
    if (phone) {
      const hasPhone = user.inventory.some((item) => item.itemId === phone.id);
      if (!hasPhone) {
        throw new Error(
          "You need a Phone to post memes! Buy one from the shop.",
        );
      }
    }

    const now = Date.now();
    const postmemeCooldown = 10 * 1000; // 10 seconds

    if (
      user.lastPostmeme &&
      now - user.lastPostmeme.getTime() < postmemeCooldown
    ) {
      const remaining = postmemeCooldown - (now - user.lastPostmeme.getTime());
      throw new Error(
        `Postmeme cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    // 15% failure chance
    const failed = Math.random() < 0.15;

    if (failed) {
      const failureMessages = [
        "Your phone died at 1%! Classic! 📱🪫",
        "WiFi went down at the worst time! 📶❌",
        "Posted to the wrong group chat! 😱💬",
        "Your meme got flagged for being too spicy! 🌶️🚫",
        "Accidentally liked your ex's post while scrolling! 😳👍",
      ];

      await storage.updateUser(user.id, {
        lastPostmeme: new Date(now),
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        meme: null,
        coins: 0,
        likes: 0,
        xp: 0,
        newBalance: user.coins,
        newXP: user.xp,
        message: `${randomMessage} No meme posted this time!`,
      };
    }

    const memeTypes = {
      normie: { name: "Normie Meme", coins: 50, likes: 100, xp: 3 },
      dank: { name: "Dank Meme", coins: 150, likes: 500, xp: 8 },
      fresh: { name: "Fresh Meme", coins: 300, likes: 1000, xp: 15 },
      spicy: { name: "Spicy Meme", coins: 500, likes: 2000, xp: 25 },
      "god-tier": { name: "God-Tier Meme", coins: 1000, likes: 5000, xp: 50 },
    };

    const selectedMemeKey =
      memeType ||
      Object.keys(memeTypes)[
        Math.floor(Math.random() * Object.keys(memeTypes).length)
      ];
    const meme =
      memeTypes[selectedMemeKey as keyof typeof memeTypes] || memeTypes["normie"];
    const actualLikes = Math.floor(meme.likes * (0.5 + Math.random() * 0.5)); // 50-100% of expected likes
    const bonusCoins = Math.floor(actualLikes / 10); // Bonus based on likes

    const totalCoins = meme.coins + bonusCoins;

    await storage.updateUser(user.id, {
      coins: user.coins + totalCoins,
      xp: user.xp + meme.xp,
      lastPostmeme: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "postmeme",
      amount: totalCoins,
      targetUser: null,
      description: `Posted ${meme.name}: ${totalCoins} coins (${actualLikes} likes), ${meme.xp} XP`,
    });

    return {
      success: true,
      meme: meme.name,
      coins: totalCoins,
      likes: actualLikes,
      xp: meme.xp,
      newBalance: user.coins + totalCoins,
      newXP: user.xp + meme.xp,
      message: `Your ${meme.name} got ${actualLikes} likes and earned ${totalCoins} coins! 📱`,
    };
  }

  // High-Low game
  static async highlow(
    username: string,
    guess: "higher" | "lower",
    betAmount: number,
  ) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    if (betAmount <= 0 || betAmount > user.coins) {
      throw new Error("Invalid bet amount");
    }

    if (betAmount < 10) {
      throw new Error("Minimum bet is 10 coins");
    }

    const currentNumber = Math.floor(Math.random() * 100) + 1;
    const nextNumber = Math.floor(Math.random() * 100) + 1;

    let correct = false;
    if (guess === "higher" && nextNumber > currentNumber) correct = true;
    if (guess === "lower" && nextNumber < currentNumber) correct = true;

    if (correct) {
      const winnings = Math.floor(betAmount * 1.8); // 1.8x multiplier

      await storage.updateUser(user.id, {
        coins: user.coins + winnings,
        xp: user.xp + 5,
      });

      await storage.createTransaction({
        user: username,
        type: "earn",
        amount: winnings,
        targetUser: null,
        description: `High-Low win: guessed ${guess} (${currentNumber} → ${nextNumber}), won ${winnings} coins`,
      });

      return {
        success: true,
        currentNumber,
        nextNumber,
        guess,
        won: winnings,
        newBalance: user.coins + winnings,
        message: `Correct! ${currentNumber} → ${nextNumber}. You won ${winnings} coins! 🎯`,
      };
    } else {
      await storage.updateUser(user.id, {
        coins: user.coins - betAmount,
      });

      await storage.createTransaction({
        user: username,
        type: "spend",
        amount: betAmount,
        targetUser: null,
        description: `High-Low loss: guessed ${guess} (${currentNumber} → ${nextNumber}), lost ${betAmount} coins`,
      });

      return {
        success: false,
        currentNumber,
        nextNumber,
        guess,
        lost: betAmount,
        newBalance: user.coins - betAmount,
        message: `Wrong! ${currentNumber} → ${nextNumber}. You lost ${betAmount} coins! 📉`,
      };
    }
  }

  // Stream system
  static async stream(username: string, gameChoice?: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    // Check if user has Camera/Streaming Setup
    const allItems = await storage.getAllItems();
    const camera = allItems.find(
      (item) =>
        item.name.toLowerCase().includes("camera") ||
        item.name.toLowerCase().includes("streaming"),
    );
    if (camera) {
      const hasCamera = user.inventory.some(
        (item) => item.itemId === camera.id,
      );
      if (!hasCamera) {
        throw new Error(
          "You need a Camera or Streaming Setup to stream! Buy one from the shop.",
        );
      }
    }

    const now = Date.now();
    const streamCooldown = 10 * 1000; // 10 seconds

    if (user.lastStream && now - user.lastStream.getTime() < streamCooldown) {
      const remaining = streamCooldown - (now - user.lastStream.getTime());
      throw new Error(
        `Stream cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    // 15% failure chance
    const failed = Math.random() < 0.15;

    if (failed) {
      const failureMessages = [
        "Stream crashed! Blue screen of death! 💻💀",
        "Your cat walked in front of the camera! 🐱📹",
        "Internet lagged at the worst moment! 📡❌",
        "Forgot to unmute for 20 minutes! 🎤🤦",
        "Accidentally showed your Discord DMs! 😳💬",
      ];

      await storage.updateUser(user.id, {
        lastStream: new Date(now),
      });

      const randomMessage =
        failureMessages[Math.floor(Math.random() * failureMessages.length)];

      return {
        success: false,
        game: null,
        viewers: 0,
        trending: false,
        coins: 0,
        xp: 0,
        newBalance: user.coins,
        newXP: user.xp,
        message: `${randomMessage} Stream failed!`,
      };
    }

    const allGames = [
      { key: "among-us", name: "Among Us", viewers: 500, coins: 200 },
      { key: "fortnite", name: "Fortnite", viewers: 1000, coins: 300 },
      { key: "minecraft", name: "Minecraft", viewers: 800, coins: 250 },
      { key: "fall-guys", name: "Fall Guys", viewers: 600, coins: 220 },
      { key: "valorant", name: "Valorant", viewers: 1200, coins: 350 },
      { key: "apex-legends", name: "Apex Legends", viewers: 900, coins: 280 },
    ];

    const trendingCount = Math.floor(Math.random() * 3);
    const trendingIndices = new Set<number>();
    while (trendingIndices.size < trendingCount) {
      trendingIndices.add(Math.floor(Math.random() * allGames.length));
    }

    const games: Record<string, any> = {};
    allGames.forEach((game, index) => {
      games[game.key] = {
        name: game.name,
        viewers: game.viewers,
        coins: game.coins,
        trending: trendingIndices.has(index),
      };
    });

    const selectedGameKey =
      gameChoice ||
      Object.keys(games)[Math.floor(Math.random() * Object.keys(games).length)];
    const game = games[selectedGameKey] || games["among-us"];
    const multiplier = game.trending ? 3 : 1; // 3x for trending games
    const totalCoins = game.coins * multiplier;
    const actualViewers = Math.floor(
      game.viewers * (0.7 + Math.random() * 0.6),
    ); // Random viewer variance

    await storage.updateUser(user.id, {
      coins: user.coins + totalCoins,
      xp: user.xp + 12,
      lastStream: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "stream",
      amount: totalCoins,
      targetUser: null,
      description: `Streamed ${game.name}: ${totalCoins} coins (${actualViewers} viewers)${game.trending ? " [TRENDING]" : ""}`,
    });

    return {
      success: true,
      game: game.name,
      viewers: actualViewers,
      trending: game.trending,
      coins: totalCoins,
      xp: 12,
      newBalance: user.coins + totalCoins,
      newXP: user.xp + 12,
      message: `You streamed ${game.name} to ${actualViewers} viewers and earned ${totalCoins} coins!${game.trending ? " 🔥 TRENDING GAME!" : ""} 📺`,
    };
  }

  // Scratch-off tickets
  static async scratch(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const scratchCooldown = 10 * 1000; // 10 seconds

    if (
      user.lastScratch &&
      now - user.lastScratch.getTime() < scratchCooldown
    ) {
      const remaining = scratchCooldown - (now - user.lastScratch.getTime());
      throw new Error(
        `Scratch cooldown: ${Math.ceil(remaining / 1000)} seconds remaining`,
      );
    }

    const tickets = [
      {
        name: "Basic Ticket",
        cost: 100,
        prizes: [0, 50, 100, 150, 200, 500],
        odds: [0.4, 0.25, 0.15, 0.1, 0.08, 0.02],
      },
      {
        name: "Premium Ticket",
        cost: 250,
        prizes: [0, 150, 300, 500, 750, 1000, 2000],
        odds: [0.35, 0.25, 0.18, 0.12, 0.07, 0.025, 0.005],
      },
      {
        name: "Mega Ticket",
        cost: 500,
        prizes: [0, 300, 600, 1000, 1500, 2500, 5000],
        odds: [0.3, 0.25, 0.2, 0.15, 0.08, 0.018, 0.002],
      },
    ];

    const ticket = tickets[Math.floor(Math.random() * tickets.length)];

    if (user.coins < ticket.cost) {
      throw new Error(`You need ${ticket.cost} coins to buy a ${ticket.name}`);
    }

    // Select prize based on odds
    const random = Math.random();
    let cumulativeOdds = 0;
    let prizeIndex = 0;

    for (let i = 0; i < ticket.odds.length; i++) {
      cumulativeOdds += ticket.odds[i];
      if (random <= cumulativeOdds) {
        prizeIndex = i;
        break;
      }
    }

    const prize = ticket.prizes[prizeIndex];
    const netGain = prize - ticket.cost;

    await storage.updateUser(user.id, {
      coins: user.coins + netGain,
      xp: user.xp + 8,
      lastScratch: new Date(now),
    });

    await storage.createTransaction({
      user: username,
      type: "scratch",
      amount: netGain,
      targetUser: null,
      description: `Scratched ${ticket.name}: cost ${ticket.cost}, won ${prize} coins (net: ${netGain > 0 ? "+" : ""}${netGain})`,
    });

    return {
      success: prize > 0,
      ticket: ticket.name,
      cost: ticket.cost,
      prize,
      netGain,
      xp: 8,
      newBalance: user.coins + netGain,
      newXP: user.xp + 8,
      message:
        prize > 0
          ? `You bought a ${ticket.name} for ${ticket.cost} coins and won ${prize} coins! Net: ${netGain > 0 ? "+" : ""}${netGain} coins! 🎫✨`
          : `You bought a ${ticket.name} for ${ticket.cost} coins but didn't win anything. Better luck next time! 🎫💸`,
    };
  }

  // Check for level up
  static async checkLevelUp(username: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) return;

    let currentLevel = user.level;
    let currentXP = user.xp;
    let levelsGained = 0;

    // Keep leveling up while user has enough XP
    while (currentXP >= currentLevel * 1000) {
      currentXP -= currentLevel * 1000;
      currentLevel++;
      levelsGained++;
    }

    // Update user if they leveled up
    if (levelsGained > 0) {
      await storage.updateUser(user.id, {
        level: currentLevel,
        xp: currentXP,
      });

      await storage.createNotification({
        user: username,
        type: "system",
        message: `🎉 Level Up! You are now level ${currentLevel}!${levelsGained > 1 ? ` (+${levelsGained} levels)` : ''}`,
        read: false,
      });
    }
  }
}