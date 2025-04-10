"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Share2, Star, Timer, Cpu, Gauge } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GalleryItemProps {
  item: {
    id: string
    title: string
    description: string
    author: {
      name: string
      avatar: string
    }
    date: string
    originalImage: string
    colorizedImage: string
    rating: number
    processingTime: string
    aiModel: string
    quality: string
  }
}

export function GalleryItem({ item }: GalleryItemProps) {
  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast({
        title: "Download started",
        description: "Your image is being downloaded",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the image",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        })
        toast({
          title: "Shared successfully",
          description: "The image has been shared",
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast({
            title: "Share failed",
            description: "There was an error sharing the image",
            variant: "destructive",
          })
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      })
    }
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{item.title}</CardTitle>
              <p className="text-sm text-muted-foreground">by {item.author.name}</p>
            </div>
          </div>
          <time className="text-sm text-muted-foreground">
            {new Date(item.date).toLocaleDateString()}
          </time>
        </div>
        {item.description && (
          <p className="text-muted-foreground">{item.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                Original
              </span>
              <img
                src={item.originalImage}
                alt="Original"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: '3/2' }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                Colorized
              </span>
              <img
                src={item.colorizedImage}
                alt="Colorized"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: '3/2' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-sm text-muted-foreground">{item.processingTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">AI Model</p>
                  <p className="text-sm text-muted-foreground">{item.aiModel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Quality</p>
                  <p className="text-sm text-muted-foreground">{item.quality}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < item.rating
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(item.colorizedImage, item.title)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}