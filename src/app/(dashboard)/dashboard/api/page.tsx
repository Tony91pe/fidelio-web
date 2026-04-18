'use client'
import { useState, useEffect } from 'react'
import UpgradeWall from '@/components/UpgradeWall'

export default function ApiAccessPage() {
  const [plan, setPlan] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [shopId, setShopId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    fetch('/api/shop/plan').then(r => r.json()).then(d => setPlan(d.plan))
    fetch('/api/shop/apikey').then(r => r.json()).then(d => { setApiKey(d.apiKey); setShopId(d.shopId) }).catch(() => {})
  }, [])

  if (plan === null) return null
  if (plan !== 'PRO') return <UpgradeWall requiredPlan="PRO" currentPlan={plan} feature="API Access" description="Integra Fidelio con i tuoi sistemi tramite API REST. Disponibile solo nel piano PRO." />

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const endpoints = [
    { method: 'GET', path: '/api/app/shops', desc: 'Lista negozi pubblici' },
    { method: 'GET', path: '/api/shop/customers', desc: 'Lista clienti del negozio' },
    { method: 'POST', path: '/api/scanner/stamp', desc: 'Assegna punti a un cliente' },
    { method: 'GET', path: '/api/shop/stats', desc: 'Statistiche del negozio' },
  ]

  return (
    <div style={{ color: 'white', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>🔑 API Access</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '2rem' }}>Integra Fidelio con i tuoi sistemi tramite REST API</p>

      {/* API Key */}
      <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontWeight: 700, color: '#a78bfa', marginBottom: '1rem' }}>La tua API Key</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <code style={{ flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: '0.83rem', fontFamily: 'monospace', wordBreak: 'break-all', color: show ? '#a78bfa' : 'rgba(255,255,255,0.2)' }}>
            {show ? apiKey : '••••••••••••••••••••••••••••••••••••••••••'}
          </code>
          <button onClick={() => setShow(!show)} style={{ background: 'rgba(255,255,255,0.07)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {show ? '🙈 Nascondi' : '👁️ Mostra'}
          </button>
          <button onClick={() => copy(apiKey!)} style={{ background: copied ? '#10b981' : '#7C3AED', color: 'white', border: 'none', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {copied ? '✓ Copiata' : '📋 Copia'}
          </button>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.75rem' }}>Shop ID: <code style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>{shopId}</code></p>
      </div>

      {/* Come usare */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Come usare l'API</p>
        <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Aggiungi l'header Authorization a ogni richiesta:</p>
        <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '12px 16px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#a78bfa', marginBottom: '0.75rem' }}>
          Authorization: Bearer {show ? apiKey : 'YOUR_API_KEY'}
        </code>
        <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Base URL:</p>
        <code style={{ display: 'block', background: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: '12px 16px', fontSize: '0.8rem', fontFamily: 'monospace', color: '#60a5fa' }}>
          https://getfidelio.app
        </code>
      </div>

      {/* Endpoint disponibili */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Endpoint principali</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {endpoints.map(e => (
            <div key={e.path} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: e.method === 'GET' ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.2)', color: e.method === 'GET' ? '#10b981' : '#a78bfa', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', flexShrink: 0 }}>{e.method}</span>
              <code style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.7)', flex: 1 }}>{e.path}</code>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>{e.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
