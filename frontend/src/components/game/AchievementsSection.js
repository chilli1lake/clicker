import React from 'react';
import { useGame } from '../../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { ACHIEVEMENTS, DAILY_CHALLENGES, WEEKLY_CHALLENGES, formatMoney } from '../../lib/gameData';
import { Trophy, Target, Calendar, CalendarDays, Check, Lock, Gift } from 'lucide-react';

export const AchievementsSection = () => {
  const { state } = useGame();
  
  const getAchievementProgress = (achievement) => {
    let progress = 0;
    switch (achievement.type) {
      case 'money': progress = state.totalMoneyEarned; break;
      case 'clicks': progress = state.clicks; break;
      case 'auctions': progress = state.auctionsWon; break;
      case 'rareItems': progress = state.rareItemsWon; break;
      case 'epicItems': progress = state.epicItemsWon; break;
      case 'mythicItems': progress = state.mythicItemsWon; break;
      case 'investments': progress = state.totalInvestments; break;
      case 'businesses': progress = Object.values(state.businesses).filter(v => v > 0).length; break;
      case 'allBusinesses': progress = Object.keys(state.businesses).length; break;
      case 'prestiges': progress = state.prestigeCount; break;
      default: break;
    }
    return Math.min(progress, achievement.target);
  };
  
  const getDailyProgress = (challenge) => {
    switch (challenge.type) {
      case 'clicks': return state.dailyClicks;
      case 'dailyMoney': return state.dailyMoney;
      case 'dailyAuctions': return state.dailyAuctions;
      case 'dailyInvestment': return state.dailyInvestment;
      case 'dailyUpgrades': return state.dailyUpgrades;
      case 'dailyTrades': return state.dailyTrades;
      default: return 0;
    }
  };
  
  const unlockedCount = state.unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  
  return (
    <Card variant="glass" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple/5 via-transparent to-gold/5 pointer-events-none" />
      
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-5 h-5 text-gold" />
          Achievements & Challenges
        </CardTitle>
        
        {/* Progress Summary */}
        <div className="mt-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Achievement Progress</span>
            <span className="text-sm font-mono">{unlockedCount}/{totalCount}</span>
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="achievements" className="gap-1 text-xs">
              <Trophy className="w-3 h-3" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="daily" className="gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1 text-xs">
              <CalendarDays className="w-3 h-3" />
              Weekly
            </TabsTrigger>
          </TabsList>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <ScrollArea className="h-[350px] pr-4">
              <div className="grid gap-2">
                {ACHIEVEMENTS.map(achievement => {
                  const isUnlocked = state.unlockedAchievements.includes(achievement.id);
                  const progress = getAchievementProgress(achievement);
                  const percentage = (progress / achievement.target) * 100;
                  
                  return (
                    <div 
                      key={achievement.id}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${isUnlocked 
                          ? 'bg-gold/10 border-gold/30' 
                          : 'bg-muted/30 border-border/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-lg flex items-center justify-center text-xl
                          ${isUnlocked ? 'bg-gold/20 achievement-glow' : 'bg-muted/50'}
                        `}>
                          {achievement.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm truncate">{achievement.name}</h4>
                            {isUnlocked && <Check className="w-4 h-4 text-success" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{achievement.description}</p>
                          
                          {!isUnlocked && (
                            <div className="mt-2">
                              <Progress value={percentage} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {progress.toLocaleString()} / {achievement.target.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            <Gift className="w-3 h-3 mr-1" />
                            +{achievement.reward.xp} XP
                          </Badge>
                          {achievement.reward.money > 0 && (
                            <p className="text-xs text-gold mt-1">
                              +{formatMoney(achievement.reward.money)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Daily Challenges Tab */}
          <TabsContent value="daily">
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  Challenges reset daily. Complete them for bonus rewards!
                </p>
                
                {state.activeDailyChallenges.map(challengeId => {
                  const challenge = DAILY_CHALLENGES.find(c => c.id === challengeId);
                  if (!challenge) return null;
                  
                  const progress = getDailyProgress(challenge);
                  const isCompleted = state.dailyChallengeProgress[challengeId];
                  const percentage = (progress / challenge.target) * 100;
                  
                  return (
                    <div 
                      key={challenge.id}
                      className={`
                        p-4 rounded-lg border transition-all
                        ${isCompleted 
                          ? 'bg-success/10 border-success/30' 
                          : 'bg-muted/30 border-border/50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className={`w-4 h-4 ${isCompleted ? 'text-success' : 'text-gold'}`} />
                          <h4 className="font-semibold text-sm">{challenge.name}</h4>
                          {isCompleted && <Check className="w-4 h-4 text-success" />}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          +{challenge.reward.xp} XP
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                      
                      {!isCompleted && (
                        <>
                          <Progress value={percentage} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">
                            {progress.toLocaleString()} / {challenge.target.toLocaleString()}
                          </p>
                        </>
                      )}
                      
                      {isCompleted && (
                        <p className="text-xs text-success">✓ Completed!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Weekly Challenges Tab */}
          <TabsContent value="weekly">
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center">
                  Weekly challenges offer bigger rewards!
                </p>
                
                {state.activeWeeklyChallenges.map(challengeId => {
                  const challenge = WEEKLY_CHALLENGES.find(c => c.id === challengeId);
                  if (!challenge) return null;
                  
                  const isCompleted = state.weeklyChallengeProgress[challengeId];
                  
                  return (
                    <div 
                      key={challenge.id}
                      className={`
                        p-4 rounded-lg border transition-all
                        ${isCompleted 
                          ? 'bg-purple/10 border-purple/30' 
                          : 'bg-muted/30 border-border/50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className={`w-4 h-4 ${isCompleted ? 'text-purple' : 'text-gold'}`} />
                          <h4 className="font-semibold text-sm">{challenge.name}</h4>
                          {isCompleted && <Check className="w-4 h-4 text-success" />}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            +{challenge.reward.xp} XP
                          </Badge>
                          <p className="text-xs text-gold mt-1">
                            +{formatMoney(challenge.reward.money)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      
                      {isCompleted && (
                        <p className="text-xs text-success mt-2">✓ Completed!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
