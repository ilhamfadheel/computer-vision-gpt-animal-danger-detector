"use client"
import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Create the preview URL when a file is selected
    if (!file) {
      setPreview(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Free memory when this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
  
    setLoading(true);
    setResult(null);
  
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
  
        // Step 1: Upload image and get animal classification
        const classificationResponse = await axios.post('/api/classify', { image: base64Image });
        const animalName = classificationResponse.data.animal;
  
        // Step 2: Check if the animal is dangerous
        const dangerResponse = await axios.post('/api/checkDanger', { animal: animalName });
        setResult(dangerResponse.data.result);
      };
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {preview && (
        <div className="mb-4">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={300}
            className="object-contain w-full h-64 rounded-lg"
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Upload an image of an animal
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={!file || loading}
          >
            {loading ? 'Processing...' : 'Upload and Analyze'}
          </button>
        </div>
      </form>
      {result && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
          <p className="font-bold">Result:</p>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}