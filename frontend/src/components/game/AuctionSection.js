import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { formatMoney, RARITY_CONFIG, AUCTION_CONFIG, generateAuctionLeaderboard } from '../../lib/gameData';
import { 
  Timer, 
  Gavel, 
  Trophy, 
  Sparkles, 
  Clock, 
  Check, 
  X,
  Crown,
  Medal,
  Users
} from 'lucide-react';

export const AuctionSection = () => {
  const { state, actions } = useGame();
  const [countdown, setCountdown] = useState('');
  const [activeTab, setActiveTab] = useState('items');
  
  const leaderboard = generateAuctionLeaderboard();
  
  // Calculate time until next auction
  useEffect(() => {
    const updateCountdown = () => {
      if (state.nextAuctionTime) {
        const diff = state.nextAuctionTime - Date.now();
        if (diff > 0) {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setCountdown('Ready!');
        }
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [state.nextAuctionTime]);
  
  const getRarityStyles = (rarity) => {
    switch(rarity) {
      case 'common': return { border: 'border-rarity-common/50', bg: 'bg-rarity-common/10', text: 'text-rarity-common' };
      case 'uncommon': return { border: 'border-rarity-uncommon/50', bg: 'bg-rarity-uncommon/10', text: 'text-rarity-uncommon' };
      case 'rare': return { border: 'border-rarity-rare/50', bg: 'bg-rarity-rare/10', text: 'text-rarity-rare' };
      case 'epic': return { border: 'border-rarity-epic/50', bg: 'bg-rarity-epic/10', text: 'text-rarity-epic' };
      case 'mythic': return { border: 'border-rarity-mythic/50', bg: 'bg-rarity-mythic/10', text: 'text-rarity-mythic' };
      default: return { border: 'border-border', bg: 'bg-muted/10', text: 'text-muted-foreground' };
    }
  };
  
  const isWinning = (item) => {
    const playerBid = state.playerBids[item.id] || 0;
    return playerBid >= item.currentBid && playerBid > 0;
  };
  
  const handleBid = (itemId, amount) => {
    actions.placeBid(itemId, amount);
  };
  
  const timeUrgent = state.auctionTimer <= 15 && state.auctionTimer > 0;
  
  // Auction Item Card
  const AuctionItemCard = ({ item }) => {
    const styles = getRarityStyles(item.rarity);
    const config = RARITY_CONFIG[item.rarity];
    const playerBid = state.playerBids[item.id] || 0;
    const winning = isWinning(item);
    
    return (
      <div className={`
        relative p-3 rounded-xl border-2 transition-all
        ${styles.border} ${styles.bg}
        ${item.rarity === 'mythic' ? 'rarity-mythic' : ''}
        hover:scale-[1.02]
      `}>
        {/* Item Image */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.rarity === 'mythic' && (
            <div className="absolute inset-0 bg-gradient-to-t from-gold/40 to-transparent animate-pulse" />
          )}
          
          {/* Rarity Badge */}
          <Badge className={`absolute top-2 left-2 text-xs ${styles.text} ${styles.bg} border-0`}>
            {config?.name}
          </Badge>
          
          {/* Win/Lose indicator */}
          <div className={`
            absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
            ${winning ? 'bg-success' : playerBid > 0 ? 'bg-destructive' : 'bg-muted/50'}
          `}>
            {winning ? <Check className="w-3 h-3 text-background" /> : 
             playerBid > 0 ? <X className="w-3 h-3 text-background" /> : null}
          </div>
        </div>
        
        {/* Item Info */}
        <h4 className="font-semibold text-sm truncate mb-1">{item.name}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <Sparkles className="w-3 h-3 text-purple" />
          +{item.xpReward} XP
        </div>
        
        {/* Bid Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Current</span>
            <span className="font-mono">{formatMoney(item.currentBid)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Your bid</span>
            <span className={`font-mono ${winning ? 'text-success' : playerBid > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {playerBid > 0 ? formatMoney(playerBid) : '—'}
            </span>
          </div>
        </div>
        
        {/* Quick Bid Buttons */}
        <div className="grid grid-cols-2 gap-1 mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleBid(item.id, 1000)}
            disabled={state.money < 1000}
            className="text-xs h-8"
          >
            +₹1K
          </Button>
          <Button 
            variant="gold" 
            size="sm"
            onClick={() => handleBid(item.id, Math.max(100, item.currentBid - playerBid + 100))}
            disabled={state.money < Math.max(100, item.currentBid - playerBid + 100)}
            className="text-xs h-8"
          >
            Win
          </Button>
        </div>
      </div>
    );
  };
  
  // Leaderboard Entry
  const LeaderboardEntry = ({ entry, rank }) => {
    const isTopThree = rank <= 3;
    
    return (
      <div className={`
        flex items-center gap-3 p-3 rounded-lg border transition-all
        ${isTopThree ? 'bg-gold/5 border-gold/20' : 'bg-muted/20 border-border/50'}
      `}>
        {/* Rank */}
        <div className="w-8 flex items-center justify-center">
          {rank === 1 ? <Crown className="w-5 h-5 text-gold" /> :
           rank === 2 ? <Medal className="w-5 h-5 text-gray-400" /> :
           rank === 3 ? <Medal className="w-5 h-5 text-amber-600" /> :
           <span className="text-sm text-muted-foreground">#{rank}</span>}
        </div>
        
        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isTopThree ? 'text-gold' : ''}`}>
            {entry.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.rareWins} rare+ items
          </p>
        </div>
        
        {/* Stats */}
        <div className="text-right">
          <p className="font-mono text-sm">{entry.wins} wins</p>
          <p className="text-xs text-muted-foreground">{formatMoney(entry.totalSpent)}</p>
        </div>
      </div>
    );
  };
  
  return (
    <Card variant="glass" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-gold/5 pointer-events-none" />
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Gavel className="w-5 h-5 text-gold" />
            Auction House
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-muted-foreground">
              <Trophy className="w-3 h-3 mr-1" />
              {state.auctionsWon} Won
            </Badge>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex-1 p-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'items' 
                ? 'bg-gold/20 text-gold border border-gold/30' 
                : 'bg-muted/30 text-muted-foreground border border-transparent hover:border-border'
            }`}
          >
            <Gavel className="w-4 h-4" />
            Auction Items
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 p-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'leaderboard' 
                ? 'bg-purple/20 text-purple border border-purple/30' 
                : 'bg-muted/30 text-muted-foreground border border-transparent hover:border-border'
            }`}
          >
            <Users className="w-4 h-4" />
            Leaderboard
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeTab === 'items' ? (
          <>
            {!state.auctionRoundActive ? (
              // No active auction
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <Gavel className="w-10 h-10 text-muted-foreground" />
                </div>
                
                {state.nextAuctionTime && Date.now() < state.nextAuctionTime ? (
                  <>
                    <p className="text-muted-foreground mb-2">Next auction in</p>
                    <p className="font-mono text-3xl text-gold mb-4">{countdown}</p>
                    <p className="text-xs text-muted-foreground">
                      Auctions run every {AUCTION_CONFIG.intervalMinutes} minutes with {AUCTION_CONFIG.itemCount} items
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">Auction ready to start!</p>
                    <Button 
                      variant="gold" 
                      size="lg"
                      onClick={actions.startAuction}
                      className="gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Auction Round
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      {AUCTION_CONFIG.itemCount} items • {AUCTION_CONFIG.timerSeconds}s per round
                    </p>
                  </>
                )}
              </div>
            ) : (
              // Active auction with items
              <div className="space-y-4">
                {/* Timer */}
                <div className={`
                  flex items-center justify-center gap-3 p-4 rounded-xl border
                  ${timeUrgent ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/30 border-border/50'}
                `}>
                  <Timer className={`w-6 h-6 ${timeUrgent ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Time Remaining</span>
                      <span className={`font-mono text-2xl ${timeUrgent ? 'countdown-urgent' : ''}`}>
                        {state.auctionTimer}s
                      </span>
                    </div>
                    <Progress 
                      value={(state.auctionTimer / AUCTION_CONFIG.timerSeconds) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
                
                {/* Items Summary */}
                <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    {state.auctionItems.length} items available
                  </span>
                  <span className="text-sm">
                    <span className="text-success">{state.auctionItems.filter(i => isWinning(i)).length} winning</span>
                    {' / '}
                    <span className="text-muted-foreground">{Object.keys(state.playerBids).length} bids</span>
                  </span>
                </div>
                
                {/* Items Grid */}
                <ScrollArea className="h-[500px] pr-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {state.auctionItems.map((item) => (
                      <AuctionItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Available Balance */}
                <div className="flex items-center justify-between p-3 bg-gold/10 rounded-lg border border-gold/20">
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                  <span className="text-gold font-mono text-lg">{formatMoney(state.money)}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          // Leaderboard Tab
          <div className="space-y-4">
            {/* Player Stats */}
            <div className="p-4 bg-gold/10 rounded-xl border border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Your Stats</span>
                <Badge variant="outline" className="text-gold">
                  Top {Math.min(20, Math.max(1, 11 - Math.floor(state.auctionsWon / 10)))}%
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-mono text-xl text-gold">{state.auctionsWon}</p>
                  <p className="text-xs text-muted-foreground">Wins</p>
                </div>
                <div>
                  <p className="font-mono text-xl text-purple">{state.rareItemsWon + state.epicItemsWon + state.mythicItemsWon}</p>
                  <p className="text-xs text-muted-foreground">Rare+</p>
                </div>
                <div>
                  <p className="font-mono text-xl">{formatMoney(state.totalSpentOnAuctions || 0)}</p>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
              </div>
            </div>
            
            {/* Leaderboard */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <LeaderboardEntry key={entry.name} entry={entry} rank={index + 1} />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionSection;
