export type Tier = {
  name: string
  color: string
  bg: string
  minPoints: number
  nextMin: number | null
  emoji: string
}

const TIERS: Tier[] = [
  { name: 'Bronze',   emoji: '🥉', color: '#CD7F32', bg: 'rgba(205,127,50,0.15)',  minPoints: 0,    nextMin: 500  },
  { name: 'Silver',   emoji: '🥈', color: '#9CA3AF', bg: 'rgba(156,163,175,0.15)', minPoints: 500,  nextMin: 1500 },
  { name: 'Gold',     emoji: '🥇', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  minPoints: 1500, nextMin: 3000 },
  { name: 'Platinum', emoji: '💎', color: '#818CF8', bg: 'rgba(129,140,248,0.15)', minPoints: 3000, nextMin: null },
]

export function getTier(points: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i]
  }
  return TIERS[0]
}

export function getTierProgress(points: number): number {
  const tier = getTier(points)
  if (!tier.nextMin) return 100
  const prev = tier.minPoints
  return Math.round(((points - prev) / (tier.nextMin - prev)) * 100)
}

export function getPointsToNextTier(points: number): number | null {
  const tier = getTier(points)
  if (!tier.nextMin) return null
  return tier.nextMin - points
}
