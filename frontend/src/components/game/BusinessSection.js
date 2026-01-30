import React from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { formatMoney, BUSINESSES, LIFE_LEVELS } from '../../lib/gameData';
import { 
  Building2, 
  Lock, 
  ArrowUp, 
  Coins,
  Coffee,
  Newspaper,
  Store,
  UtensilsCrossed,
  Laptop,
  Hotel,
  Crown
} from 'lucide-react';

// Icon mapping for businesses
const BusinessIcon = ({ iconName, className }) => {
  const icons = {
    Coffee: Coffee,
    Newspaper: Newspaper,
    Store: Store,
    UtensilsCrossed: UtensilsCrossed,
    Laptop: Laptop,
    Hotel: Hotel,
    Building2: Building2,
    Crown: Crown
  };
  
  const Icon = icons[iconName] || Building2;
  return <Icon className={className} />;
};

export const BusinessSection = () => {
  const { state, actions } = useGame();
  
  const currentLevel = LIFE_LEVELS.find(l => l.level === state.level) || LIFE_LEVELS[0];
  
  const getBusinessCost = (business) => {
    const currentCount = state.businesses[business.id] || 0;
    return Math.floor(business.baseCost * Math.pow(business.costMultiplier, currentCount));
  };
  
  const getBusinessIncome = (business) => {
    const count = state.businesses[business.id] || 0;
    return count * business.baseIncome * currentLevel.incomeBonus * state.prestigeBonus * state.moneyMultiplier;
  };
  
  const isUnlocked = (business) => {
    return state.level >= business.unlockLevel;
  };
  
  return (
    <Card variant="glass" className="relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building2 className="w-5 h-5 text-gold" />
          Business Empire
        </CardTitle>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Total Businesses</p>
            <p className="font-mono text-lg text-foreground">
              {Object.values(state.businesses).reduce((a, b) => a + (b || 0), 0)}
            </p>
          </div>
          <div className="p-2 bg-muted/30 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Passive/sec</p>
            <p className="font-mono text-lg text-gold">
              {formatMoney(state.passiveIncome * currentLevel.incomeBonus * state.prestigeBonus * state.moneyMultiplier)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {BUSINESSES.map((business) => {
              const cost = getBusinessCost(business);
              const count = state.businesses[business.id] || 0;
              const income = getBusinessIncome(business);
              const unlocked = isUnlocked(business);
              const canAfford = state.money >= cost;
              
              return (
                <div 
                  key={business.id}
                  className={`
                    p-4 rounded-xl border transition-all
                    ${unlocked 
                      ? 'bg-muted/30 border-border/50 hover:border-gold/30' 
                      : 'bg-muted/10 border-border/30 opacity-60'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${unlocked ? 'bg-gold/10 border border-gold/20' : 'bg-muted/50 border border-border/30'}
                    `}>
                      {unlocked ? (
                        <BusinessIcon iconName={business.iconName} className="w-6 h-6 text-gold" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{business.name}</h4>
                        {count > 0 && (
                          <Badge variant="outline" className="text-xs text-gold border-gold/30">
                            x{count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{business.description}</p>
                      
                      {unlocked ? (
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1 text-gold">
                            <Coins className="w-3 h-3" />
                            +{formatMoney(business.baseIncome)}/s
                          </span>
                          <span className="flex items-center gap-1 text-purple">
                            <ArrowUp className="w-3 h-3" />
                            +{business.perClick}/click
                          </span>
                          {income > 0 && (
                            <span className="text-success">
                              Earning: {formatMoney(income)}/s
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Unlocks at Level {business.unlockLevel}
                        </p>
                      )}
                    </div>
                    
                    {/* Buy Button */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant={canAfford && unlocked ? "gold" : "outline"}
                        size="sm"
                        onClick={() => actions.buyBusiness(business.id)}
                        disabled={!unlocked || !canAfford}
                        className="min-w-[100px]"
                      >
                        {unlocked ? (
                          formatMoney(cost)
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BusinessSection;
