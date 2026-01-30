import React, { useState, useCallback, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent } from '../ui/card';
import { formatMoney, LIFE_LEVELS } from '../../lib/gameData';
import { 
  Sparkles, 
  TrendingUp, 
  Zap,
  BookOpen,
  GraduationCap,
  Briefcase,
  LineChart,
  Rocket,
  Gem,
  Crown,
  CircleDollarSign
} from 'lucide-react';

// Icon mapping for life levels
const LevelIcon = ({ iconName, className }) => {
  const icons = {
    BookOpen: BookOpen,
    GraduationCap: GraduationCap,
    Briefcase: Briefcase,
    LineChart: LineChart,
    Rocket: Rocket,
    TrendingUp: TrendingUp,
    Gem: Gem,
    Crown: Crown
  };
  
  const Icon = icons[iconName] || BookOpen;
  return <Icon className={className} />;
};

export const ClickerSection = () => {
  const { state, actions } = useGame();
  const [isClicking, setIsClicking] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState([]);
  const coinIdRef = useRef(0);
  
  const currentLevel = LIFE_LEVELS.find(l => l.level === state.level) || LIFE_LEVELS[0];
  const earnPerClick = state.clickPower * currentLevel.clickBonus * state.prestigeBonus * state.moneyMultiplier;
  
  const handleClick = useCallback(() => {
    actions.click();
    setIsClicking(true);
    
    // Create floating coin
    const coinId = coinIdRef.current++;
    const randomX = (Math.random() - 0.5) * 100;
    
    setFloatingCoins(prev => [...prev, { id: coinId, x: randomX, amount: earnPerClick }]);
    
    // Remove coin after animation
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(c => c.id !== coinId));
    }, 1000);
    
    setTimeout(() => setIsClicking(false), 150);
  }, [actions, earnPerClick]);
  
  const nextLevel = LIFE_LEVELS.find(l => l.level === state.level + 1);
  const xpProgress = nextLevel 
    ? ((state.totalXpEarned - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100
    : 100;
  
  return (
    <Card variant="glass" className="relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple/5 pointer-events-none" />
      
      <CardContent className="p-6 md:p-8">
        {/* Level Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-xl border border-gold/20">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <LevelIcon iconName={currentLevel.iconName} className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Life Stage</p>
              <p className="font-display text-lg text-gold">{currentLevel.name}</p>
            </div>
            <span className="text-sm text-muted-foreground px-2 py-1 bg-muted/30 rounded-lg">Lv.{state.level}</span>
          </div>
        </div>
        
        {/* XP Progress */}
        {nextLevel && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>XP to {nextLevel.name}</span>
              <span>{state.totalXpEarned.toFixed(0)} / {nextLevel.xpRequired}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple to-purple-light transition-all duration-500 progress-glow"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Main Click Area */}
        <div className="relative flex flex-col items-center">
          {/* Floating Coins */}
          {floatingCoins.map(coin => (
            <div
              key={coin.id}
              className="absolute top-1/2 left-1/2 coin-float pointer-events-none z-10"
              style={{ transform: `translateX(${coin.x}px)` }}
            >
              <span className="text-gold font-bold text-lg">
                +{formatMoney(coin.amount)}
              </span>
            </div>
          ))}
          
          {/* Click Button */}
          <button
            onClick={handleClick}
            className={`
              relative w-40 h-40 md:w-48 md:h-48 rounded-full
              bg-gradient-to-br from-gold-dark via-gold to-gold-light
              shadow-gold-lg hover:shadow-[0_0_60px_hsl(43_74%_49%_/_0.5)]
              transition-all duration-300 cursor-pointer
              flex items-center justify-center
              group
              ${isClicking ? 'click-pulse scale-95' : 'hover:scale-105'}
            `}
          >
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold-light/40 to-transparent" />
            
            {/* Icon */}
            <div className="relative z-10 flex flex-col items-center">
              <CircleDollarSign className="w-14 h-14 md:w-16 md:h-16 text-background mb-1" />
              <span className="text-background font-bold text-lg">CLICK</span>
            </div>
            
            {/* Pulse ring on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-gold-light/30 group-hover:scale-110 group-hover:opacity-0 transition-all duration-500" />
          </button>
          
          {/* Per Click Info */}
          <div className="mt-6 flex items-center gap-2 text-gold">
            <Zap className="w-5 h-5" />
            <span className="font-semibold text-lg">{formatMoney(earnPerClick)}</span>
            <span className="text-muted-foreground text-sm">per click</span>
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Total Clicks</p>
            <p className="font-mono text-lg text-foreground">{state.clicks.toLocaleString()}</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Passive/sec</p>
            <p className="font-mono text-lg text-gold flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {formatMoney(state.passiveIncome * currentLevel.incomeBonus * state.prestigeBonus * state.moneyMultiplier)}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Prestige</p>
            <p className="font-mono text-lg text-purple flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              x{state.prestigeBonus.toFixed(1)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClickerSection;
