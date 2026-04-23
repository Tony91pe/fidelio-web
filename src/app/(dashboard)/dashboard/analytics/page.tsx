'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type Analytics = {
  totalCustomers: number
  activeCustomers: number
  atRiskCustomers: number
  newCustomers30: number
  newCustomersTrend: number
  totalPoints: number
  avgPoints: number
  totalRedeemed: number
  recentVisits: number
  weekVisits: number
  allVisits: number
  retentionRate: number
  avgVisits: number
  loyalCustomers: number
  churnRate: number
  avgDaysBetweenVisits: number | null
  topCustomers: { id: string; name: string; email: string; points: number; totalVisits: number; lastVisitAt: string | null }[]
  topRewards: { title: string; count: number }[]
  visitsByDay: { label: string; count: number }[]
  monthlyTrend: { label: string; count: number }[]
}

function StatCard({ label, value, sub, icon, color, trend }: {
  label: string; value: string | number; sub?: string; icon: string; color: string; trend?: number
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '1.4rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
        {trend !== undefined && (
          <span style={{
            fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '100px',
            background: trend >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: trend >= 0 ? '#10B981' : '#EF4444',
          }}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: '800', color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  )
}

function BarChart({ data, color = '#6C3DF4' }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.count), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px' }}>
      {data.map(d => (
        <div key={d.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
            {d.count > 0 ? d.count : ''}
          </div>
          <div style={{
            width: '100%', borderRadius: '4px',
            height: `${Math.round((d.count / max) * 72) + 4}px`,
            background: d.count === max ? color : `${color}55`,
            transition: 'height 0.3s',
          }} />
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/analytics')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (plan === 'STARTER') {
    return (
      <UpgradeWall
        requiredPlan="GROWTH"
        currentPlan={plan}
        feature="Statistiche Avanzate"
        description="Analisi dettagliate su clienti, punti, visite e tendenze. Disponibile dal piano Growth."
      />
    )
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>Caricamento...</div>
  if (!data) return <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>Errore nel caricamento</div>

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.4rem' }}>Analytics</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>Analisi completa del tuo negozio</p>

      {/* KPI principali */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Clienti totali" value={data.totalCustomers} icon="👥" color="#6C3DF4"
          sub={`${data.newCustomers30} nuovi questo mese`} trend={data.newCustomersTrend} />
        <StatCard label="Clienti attivi (30gg)" value={data.activeCustomers} icon="🔥" color="#10B981"
          sub={`${data.totalCustomers > 0 ? Math.round((data.activeCustomers / data.totalCustomers) * 100) : 0}% del totale`} />
        <StatCard label="A rischio abbandono" value={data.atRiskCustomers} icon="⚠️" color="#EF4444"
          sub="Non visitano da >30 giorni" />
        <StatCard label="Retention rate" value={`${data.retentionRate}%`} icon="🔄" color="#F59E0B"
          sub={`${data.loyalCustomers} clienti fedeli`} />
      </div>

      {/* KPI secondari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Premi riscattati" value={data.totalRedeemed} icon="🎁" color="#A78BFA"
          sub="Totale storico" />
        <StatCard label="Churn rate" value={`${data.churnRate}%`} icon="📉" color={data.churnRate > 30 ? '#EF4444' : '#10B981'}
          sub="Clienti persi vs attivi" />
        <StatCard label="Freq. media visite" value={data.avgDaysBetweenVisits != null ? `${data.avgDaysBetweenVisits}gg` : '—'} icon="🔁" color="#10B981"
          sub="Giorni tra una visita e l'altra" />
        <StatCard label="Media punti/cliente" value={data.avgPoints} icon="⭐" color="#F59E0B"
          sub={`${data.allVisits} visite totali`} />
      </div>

      {/* Grafici: visite per giorno + trend mensile */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Visite per giorno</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>Ultimi 30 giorni</p>
          <BarChart data={data.visitsByDay} color="#6C3DF4" />
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Nuovi clienti</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>Ultimi 6 mesi</p>
          <BarChart data={data.monthlyTrend} color="#10B981" />
        </div>
      </div>

      {/* Salute negozio + Top premi */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Salute del negozio</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>Indicatori chiave</p>
          {[
            { label: 'Tasso attivazione', value: data.totalCustomers > 0 ? Math.round((data.activeCustomers / data.totalCustomers) * 100) : 0, color: '#10B981' },
            { label: 'Retention', value: data.retentionRate, color: '#A78BFA' },
            { label: 'Churn', value: data.churnRate, color: '#EF4444' },
            { label: 'Clienti a rischio', value: data.totalCustomers > 0 ? Math.round((data.atRiskCustomers / data.totalCustomers) * 100) : 0, color: '#F59E0B' },
          ].map(metric => (
            <div key={metric.label} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{metric.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: metric.color }}>{metric.value}%</span>
              </div>
              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(metric.value, 100)}%`, background: metric.color, borderRadius: '3px', transition: 'width 0.5s' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Premi più riscattati</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>Top 5 storici</p>
          {data.topRewards.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Nessun riscatto ancora</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.topRewards.map((r, i) => {
                const maxCount = data.topRewards[0]?.count ?? 1
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#A78BFA', marginLeft: '0.5rem' }}>{r.count}x</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.round((r.count / maxCount) * 100)}%`, background: '#A78BFA', borderRadius: '2px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tier fedeltà */}
      {data.totalCustomers > 0 && (() => {
        const tiers = [
          { label: 'Nuovo', range: '0–99 pt', min: 0, max: 99, color: '#6b7280', icon: '🌱' },
          { label: 'Bronzo', range: '100–499 pt', min: 100, max: 499, color: '#CD7F32', icon: '🥉' },
          { label: 'Argento', range: '500–1999 pt', min: 500, max: 1999, color: '#C0C0C0', icon: '🥈' },
          { label: 'Oro', range: '2000–4999 pt', min: 2000, max: 4999, color: '#FFD700', icon: '🥇' },
          { label: 'Platino', range: '5000+ pt', min: 5000, max: Infinity, color: '#A78BFA', icon: '💎' },
        ]
        const counts = tiers.map(t => data.topCustomers.filter(c => c.points >= t.min && c.points <= t.max).length)
        const maxCount = Math.max(...counts, 1)
        return (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Livelli fedeltà clienti</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Distribuzione per tier di punti</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {tiers.map((t, i) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{t.icon}</span>
                  <div style={{ width: '70px', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: t.color }}>{t.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>{t.range}</div>
                  </div>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.round((counts[i] / maxCount) * 100)}%`, background: t.color, borderRadius: '4px', transition: 'width 0.5s', opacity: 0.85 }} />
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'rgba(255,255,255,0.6)', width: '24px', textAlign: 'right' }}>{counts[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Top clienti */}
      {data.topCustomers.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>Top clienti</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '1.2rem' }}>I tuoi clienti più fedeli</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {data.topCustomers.map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 0 ? 'rgba(255,215,0,0.2)' : i === 1 ? 'rgba(192,192,192,0.2)' : 'rgba(205,127,50,0.2)',
                  fontSize: '0.75rem', fontWeight: '800',
                  color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : '#CD7F32',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{c.totalVisits} visite · ogni {data.avgDaysBetweenVisits ?? '?'}gg in media</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#A78BFA' }}>{c.points} pt</div>
                  {c.lastVisitAt && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(c.lastVisitAt).toLocaleDateString('it-IT')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
