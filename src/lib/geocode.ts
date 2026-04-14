export async function geocodeAddress(address: string, city: string): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, Italy`)
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
  const data = await res.json()
  if (!data[0]) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}
