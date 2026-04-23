'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'welcome' | 'points' | 'reward' | 'qr'

const STEPS: Step[] = ['welcome', 'points', 'reward', 'qr']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [shop, setShop] = useState<{ name: string; id: string; rewardThreshold: number; pointsPerVisit: number } | null>(null)
  const [rewardTitle, setRewardTitle] = useState('')
  const [rewardPoints, setRewardPoints] = useState(100)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/shop/settings').then(r => r.json()).then(d => {
      setShop({ name: d.name, id: d.id, rewardThreshold: d.rewardThreshold, pointsPerVisit: d.pointsPerVisit })
      setRewardPoints(d.rewardThreshold)
      if (d.onboardingCompleted) router.replace('/dashboard')
    })
  }, [router])

  const stepIndex = STEPS.indexOf(step)
  const pct = Math.round(((stepIndex + 1) / STEPS.length) * 100)

  async function handleFinish() {
    setSaving(true)
    // Salva impostazioni punti se cambiate
    await fetch('/api/shop/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardThreshold: rewardPoints }),
    })
    // Crea primo premio se inserito
    if (rewardTitle.trim()) {
      await fetch('/api/shop/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: rewardTitle, pointsCost: rewardPoints, description: '', active: true }),
      })
    }
    // Marca onboarding completato
    await fetch('/api/onboarding/complete', { method: 'POST' })
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  function next() {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1])
    else handleFinish()
  }

  function prev() {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  if (!shop) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ color: 'rgba(255,255,255,0.4)' }}>Caricamento...</div>
    </div>
  )

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tutto pronto!</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)' }}>Stai entrando nella dashboard...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Progress */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>Passo {stepIndex + 1} di {STEPS.length}</span>
            <span style={{ fontSize: '0.82rem', color: '#A78BFA', fontWeight: '700' }}>{pct}%</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6C3DF4,#A78BFA)', borderRadius: '2px', transition: 'width 0.4s' }} />
          </div>
        </div>

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>👋</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>Benvenuto su Fidelio!</h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
              Ciao! Il tuo negozio <strong style={{ color: 'white' }}>{shop.name}</strong> è attivo.<br />
              Configuriamolo insieme in 2 minuti.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '2rem', marginBottom: '0.5rem', textAlign: 'left' }}>
              {[
                { icon: '⚙️', text: 'Configuriamo il sistema punti' },
                { icon: '🎁', text: 'Creiamo il tuo primo premio' },
                { icon: '📱', text: 'Ottieni il QR code pronto da stampare' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '10px' }}>
                  <span>{item.icon}</span>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: Points config */}
        {step === 'points' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>⚙️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>Quanti punti per ottenere un premio?</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
              Ogni visita vale <strong style={{ color: 'white' }}>{shop.pointsPerVisit} punti</strong>.<br />
              Scegli quanti punti servono per riscattare il premio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Ogni 5 visite', value: shop.pointsPerVisit * 5, desc: 'Alta frequenza — ideale per bar e caffetterie' },
                { label: 'Ogni 10 visite', value: shop.pointsPerVisit * 10, desc: 'Bilanciato — il più usato' },
                { label: 'Ogni 20 visite', value: shop.pointsPerVisit * 20, desc: 'Premio esclusivo — per negozi con alta frequenza' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRewardPoints(opt.value)}
                  style={{
                    padding: '1rem 1.25rem', borderRadius: '12px', border: `2px solid ${rewardPoints === opt.value ? '#6C3DF4' : 'rgba(255,255,255,0.08)'}`,
                    background: rewardPoints === opt.value ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'white', marginBottom: '2px' }}>{opt.label} <span style={{ color: '#A78BFA', fontWeight: '400', fontSize: '0.82rem' }}>({opt.value} pt)</span></div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</div>
                </button>
              ))}
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>O inserisci un valore personalizzato</label>
                <input
                  type="number" min={10} max={10000} value={rewardPoints}
                  onChange={e => setRewardPoints(parseInt(e.target.value) || rewardPoints)}
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step: First reward */}
        {step === 'reward' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🎁</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>Crea il tuo primo premio</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '2rem', lineHeight: 1.6 }}>
              Cosa ottiene il cliente quando raggiunge <strong style={{ color: 'white' }}>{rewardPoints} punti</strong>?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {['Caffè gratis', 'Sconto 10%', 'Prodotto omaggio', 'Taglio gratis', 'Dessert gratis'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRewardTitle(s)}
                  style={{
                    padding: '0.75rem 1rem', borderRadius: '10px', border: `1px solid ${rewardTitle === s ? '#6C3DF4' : 'rgba(255,255,255,0.08)'}`,
                    background: rewardTitle === s ? 'rgba(108,61,244,0.15)' : 'rgba(255,255,255,0.03)',
                    cursor: 'pointer', color: 'white', fontWeight: rewardTitle === s ? '600' : '400', textAlign: 'left', transition: 'all 0.15s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>O scrivi il tuo premio personalizzato</label>
            <input
              type="text" placeholder="Es. Cocktail omaggio, Pizza gratis..."
              value={rewardTitle}
              onChange={e => setRewardTitle(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 14px', color: 'white', width: '100%', outline: 'none', fontSize: '14px' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>Puoi saltare e aggiungere premi in seguito dalla sezione Premi</p>
          </div>
        )}

        {/* Step: QR */}
        {step === 'qr' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.75rem' }}>Il tuo QR code è pronto!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Posizionalo alla cassa. I clienti lo scansionano con la fotocamera del telefono e si iscrivono in 10 secondi — senza app.
            </p>
            <div style={{ background: 'rgba(108,61,244,0.08)', border: '1px solid rgba(108,61,244,0.2)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                💡 <strong>Consiglio:</strong> stampa il QR in formato A5 e plastificalo. Mettilo sul bancone accanto alla cassa — è lì che il cliente ha 30 secondi di attesa.
              </div>
            </div>
            <a
              href="/dashboard/qr"
              style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '12px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.75rem' }}
            >
              📥 Vai al QR code →
            </a>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={prev}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: '600', cursor: 'pointer' }}
            >
              ← Indietro
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={saving}
            style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#6C3DF4', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '15px', opacity: saving ? 0.7 : 1 }}
          >
            {saving ? 'Salvataggio...' : step === 'qr' ? '🚀 Inizia con Fidelio!' : 'Continua →'}
          </button>
        </div>

        {step !== 'welcome' && (
          <button
            type="button"
            onClick={handleFinish}
            style={{ display: 'block', width: '100%', marginTop: '0.75rem', padding: '10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Salta configurazione →
          </button>
        )}
      </div>
    </div>
  )
}
