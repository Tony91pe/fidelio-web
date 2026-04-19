import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const count = await db.shop.count({ where: { isFounder: true } })
const shops = await db.shop.findMany({ where: { isFounder: true }, select: { id: true, name: true, ownerEmail: true } })
console.log('Founder count:', count)
shops.forEach(s => console.log(' -', s.name, s.ownerEmail))
await db.$disconnect()
