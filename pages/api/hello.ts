// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from 'drizzle-orm'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../db'
import { loveTable } from '../../db/schema'

interface Data {
  count?: number
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'GET') {
    const result = await db.select().from(loveTable)
    return res.status(200).json({ count: result[0].count })
  }
  else if (req.method === 'POST') {
    const result = await db.update(loveTable).set({ count: sql`${loveTable.count} + 1` }).returning({ count: loveTable.count })
    return res.status(200).json({ count: result[0].count })
  }

  return res.status(405).json({ message: 'Method Not Allowed' })
}
