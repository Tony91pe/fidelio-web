'use client'

import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

type NpsResponse = { score: number; feedback: string | null; createdAt: string }
type NpsData = { total: number; avg: number | null; nps: number | null; responses: NpsResponse[] }

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 9 ? '#10B981' : score >= 7 ? '#F59E0B' : '#EF4444'
  const label = score >= 9 ? 'Promotore' : score >= 7 ? 'Passivo' : 'Detrattore'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', background: `${color}18`, color, border: `1px solid ${color}30` }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 900 }}>{score}</span>
      <span style={{ fontWeight: 500, opacity: 0.8 }}>{label}</span>
    </span>
  )
}

function NpsGauge({ nps }: { nps: number }) {
  const color = nps >= 50 ? '#10B981' : nps >= 0 ? '#F59E0B' : '#EF4444'
  const label = nps >= 50 ? 'Eccellente' : nps >= 0 ? 'Da migliorare' : 'Critico'
  return (
    <div style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '4rem', fontWeight: 900, color, lineHeight: 1 }}>
        {nps > 0 ? '+' : ''}{nps}
      </div>
      <p style={{ fontSize: '0.85rem', fontWeight: '700', color, marginTop: '0.4rem' }}>{label}</p>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>NPS Score</p>
    </div>
  )
}

export default function NpsPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [data, setData] = useState<NpsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/nps')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (plan === 'STARTER') {
    return (
      <UpgradeWall
        requiredPlan="GROWTH"
        currentPlan={plan}
        feature="NPS & Soddisfazione Clienti"
        description="Monitora il Net Promoter Score e la soddisfazione dei tuoi clienti in tempo reale. Disponibile dal piano Growth."
      />
    )
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>Caricamento...</div>

  if (!data || data.total === 0) {
    return (
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.4rem' }}>NPS & Soddisfazione</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2.5rem' }}>Net Promoter Score dei tuoi clienti</p>
        <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Nessuna risposta ancora</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
            I clienti ricevono un sondaggio NPS dopo il check-in. Le risposte compariranno qui non appena inizieranno ad arrivare.
          </p>
        </div>
      </div>
    )
  }

  const promoters = data.responses.filter(r => r.score >= 9).length
  const passives = data.responses.filter(r => r.score >= 7 && r.score <= 8).length
  const detractors = data.responses.filter(r => r.score <= 6).length
  const promoterPct = Math.round((promoters / data.total) * 100)
  const passivePct = Math.round((passives / data.total) * 100)
  const detractorPct = Math.round((detractors / data.total) * 100)

  const distribution = Array.from({ length: 11 }, (_, i) => ({
    score: i,
    count: data.responses.filter(r => r.score === i).length,
  }))
  const maxDist = Math.max(...distribution.map(d => d.count), 1)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.4rem' }}>NPS & Soddisfazione</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem' }}>{data.total} risposte totali · Media {data.avg}/10</p>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* NPS gauge */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <NpsGauge nps={data.nps ?? 0} />
          <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Promotori (9-10)', pct: promoterPct, count: promoters, color: '#10B981' },
              { label: 'Passivi (7-8)', pct: passivePct, count: passives, color: '#F59E0B' },
              { label: 'Detrattori (0-6)', pct: detractorPct, count: detractors, color: '#EF4444' },
            ].map(({ label, pct, count, color }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color }}>{pct}% <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>({count})</span></span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuzione punteggi */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1.25rem', fontSize: '1rem' }}>Distribuzione punteggi</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100px', marginBottom: '0.5rem' }}>
            {distribution.map(({ score, count }) => {
              const color = score >= 9 ? '#10B981' : score >= 7 ? '#F59E0B' : '#EF4444'
              return (
                <div key={score} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>{count > 0 ? count : ''}</div>
                  <div style={{
                    width: '100%', borderRadius: '3px 3px 0 0',
                    height: `${Math.round((count / maxDist) * 72) + 4}px`,
                    background: count > 0 ? color : 'rgba(255,255,255,0.06)',
                    transition: 'height 0.5s',
                  }} />
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>{score}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Risposte con feedback */}
      {data.responses.some(r => r.feedback) && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '1rem' }}>Feedback ricevuti</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.responses.filter(r => r.feedback).map((r, i) => (
              <div key={i} style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <ScoreBadge score={r.score} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    {new Date(r.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>{r.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
