import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
const result = await db.shop.updateMany({
  where: { name: 'Roma' },
  data: { ownerEmail: 'antonio.webdev.it@gmail.com' },
})
console.log('Aggiornati:', result.count, 'negozi')
await db.$disconnect()
