import Image from 'next/image'
import { Inter } from 'next/font/google'
import ImageUploader from '@/components/ImageUploader'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Animal Danger Detector</h1>
      <ImageUploader />
    </main>
  )
}