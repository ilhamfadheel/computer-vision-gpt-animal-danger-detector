import { NextApiRequest, NextApiResponse } from 'next';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const imageData = req.body.image;
    if (!imageData) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');

    // Use a Hugging Face model for image classification
    const result = await hf.imageClassification({
      data: buffer,
      model: 'microsoft/resnet-50',
    });

    // Find the label with the highest score
    const topPrediction = result.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    res.status(200).json({ animal: topPrediction.label });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error classifying image' });
  }
}