import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Fidelio — Programma fedeltà digitale per negozi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0D0D1A 0%, #1a0a3d 50%, #0D0D1A 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(108,61,244,0.4) 0%, transparent 70%)',
          }}
        />

        {/* Logo dot + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#6C3DF4' }} />
          <span style={{ fontSize: '36px', fontWeight: '800', color: 'white', letterSpacing: '-1px' }}>
            Fidelio
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '800',
            color: 'white',
            textAlign: 'center',
            lineHeight: '1.1',
            maxWidth: '900px',
            letterSpacing: '-2px',
          }}
        >
          Fai tornare i tuoi
          <br />
          <span style={{ color: '#A78BFA' }}>clienti ogni giorno</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.55)',
            marginTop: '24px',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: '1.5',
          }}
        >
          Punti digitali · QR code · Email automatiche · AI
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
          {['€19/mese', 'Setup in 10 min', 'Nessuna app'].map(label => (
            <div
              key={label}
              style={{
                background: 'rgba(108,61,244,0.2)',
                border: '1px solid rgba(108,61,244,0.4)',
                borderRadius: '100px',
                padding: '8px 20px',
                fontSize: '18px',
                color: '#C4B5FD',
                fontWeight: '600',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{ position: 'absolute', bottom: '32px', color: 'rgba(255,255,255,0.25)', fontSize: '20px' }}>
          getfidelio.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
