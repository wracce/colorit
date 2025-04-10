"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useColorizeStore } from "@/lib/store/colorize-store"
import { Upload, Star, Save, Share2 } from "lucide-react"

export default function ColorizePage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { 
    originalImage, 
    colorizedImage, 
    title, 
    rating,
    setOriginalImage, 
    setColorizedImage, 
    setTitle, 
    setRating 
  } = useColorizeStore()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setOriginalImage(reader.result as string)
        // Simulate colorization process
        setIsProcessing(true)
        setTimeout(() => {
          setColorizedImage(reader.result as string)
          setIsProcessing(false)
        }, 2000)
      }
      reader.readAsDataURL(file)
    }
  }, [setOriginalImage, setColorizedImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false
  })

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving...', { originalImage, colorizedImage, title, rating })
  }

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing...', { originalImage, colorizedImage, title, rating })
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Image Colorizer</CardTitle>
          <CardDescription>
            Transform your black and white photos into vibrant, colorized images using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image Section */}
            <div 
              {...getRootProps()} 
              className={`
                flex flex-col items-center justify-center min-h-[300px] 
                rounded-lg border-2 border-dashed transition-colors
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                ${originalImage ? 'p-0' : 'p-8'}
              `}
            >
              <input {...getInputProps()} />
              {originalImage ? (
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-center space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {isDragActive ? 
                      "Drop your image here" : 
                      "Drag & drop an image here, or click to select"
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Colorized Image Section */}
            <div className="min-h-[300px] rounded-lg bg-muted/50 flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-muted-foreground">Processing image...</p>
                </div>
              ) : colorizedImage ? (
                <img 
                  src={colorizedImage} 
                  alt="Colorized" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <p className="text-muted-foreground">Colorized image will appear here</p>
              )}
            </div>
          </div>

          {/* Rating and Title Section */}
          {colorizedImage && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Image Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your image"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium block text-center">
                  Rating
                </label>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          value <= rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {colorizedImage && (
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Publicly
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  )
}