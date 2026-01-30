import React, { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { RANDOM_EVENTS } from '../../lib/gameData';
import { X, Zap, AlertTriangle, Gift, TrendingUp, TrendingDown } from 'lucide-react';

export const EventNotification = () => {
  const { state } = useGame();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (state.activeEvent) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [state.activeEvent]);
  
  if (!state.activeEvent || !isVisible) return null;
  
  const event = state.activeEvent;
  
  const getEventColor = () => {
    switch (event.type) {
      case 'positive': return 'from-success/20 via-success/10 to-transparent border-success/40';
      case 'negative': return 'from-destructive/20 via-destructive/10 to-transparent border-destructive/40';
      case 'neutral': return 'from-gold/20 via-gold/10 to-transparent border-gold/40';
      default: return 'from-muted/20 via-muted/10 to-transparent border-border';
    }
  };
  
  const getEventIcon = () => {
    switch (event.type) {
      case 'positive': return <Gift className="w-6 h-6 text-success" />;
      case 'negative': return <AlertTriangle className="w-6 h-6 text-destructive" />;
      case 'neutral': return <Zap className="w-6 h-6 text-gold" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };
  
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-in-right">
      <div className={`
        relative overflow-hidden rounded-xl border-2 backdrop-blur-sm
        bg-gradient-to-r ${getEventColor()}
      `}>
        {/* Animated background */}
        {event.type === 'positive' && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--success)/0.2),transparent)] animate-pulse" />
        )}
        
        <div className="relative p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
            ${event.type === 'positive' ? 'bg-success/20' : 
              event.type === 'negative' ? 'bg-destructive/20' : 
              'bg-gold/20'}
          `}>
            <span className="text-2xl">{event.icon}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-lg font-semibold mb-1">{event.name}</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
            
            {/* Effect indicators */}
            {event.effect.xp && (
              <p className="text-sm text-purple mt-2">+{event.effect.xp} XP</p>
            )}
            {event.effect.money && (
              <p className="text-sm text-gold mt-2">+₹{event.effect.money.toLocaleString()}</p>
            )}
            {event.effect.duration && (
              <p className="text-xs text-muted-foreground mt-2">
                Active for {event.effect.duration}s
              </p>
            )}
          </div>
          
          {/* Close button */}
          <button 
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress bar for timed events */}
        {event.effect.duration && state.eventEndTime && (
          <div className="h-1 bg-muted">
            <div 
              className={`h-full transition-all ${
                event.type === 'positive' ? 'bg-success' : 
                event.type === 'negative' ? 'bg-destructive' : 
                'bg-gold'
              }`}
              style={{
                width: `${Math.max(0, ((state.eventEndTime - Date.now()) / (event.effect.duration * 1000)) * 100)}%`,
                transition: 'width 1s linear'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventNotification;
