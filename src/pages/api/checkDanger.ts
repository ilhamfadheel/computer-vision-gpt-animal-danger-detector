import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { animal } = req.body

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that determines if animals are dangerous based on Wikipedia information." },
          { role: "user", content: `Is a ${animal} dangerous? Provide a brief explanation.` }
        ],
      })

      res.status(200).json({ result: completion.choices[0].message?.content })
    } catch (error) {
      res.status(500).json({ error: 'Error checking if animal is dangerous' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}