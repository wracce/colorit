"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Download, Share2, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [visibleItems, setVisibleItems] = useState(3)
  
  // Sample gallery items
  const allItems = [
    {
      id: 1,
      title: "Mountain Lake at Sunset",
      description: "A serene mountain lake captured during the golden hour",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&q=80"
      },
      date: "2024-03-20T14:30:00Z",
      originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=600&h=400&fit=crop&q=80",
      colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=600&h=400&fit=crop&q=80",
      rating: 4,
      isOwn: false
    },
    {
      id: 2,
      title: "Desert Landscape at Dawn",
      description: "The first light breaking over endless sand dunes",
      author: {
        name: "Jane Smith",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&q=80"
      },
      date: "2024-03-19T10:15:00Z",
      originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=600&h=400&fit=crop&q=80",
      colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=600&h=400&fit=crop&q=80",
      rating: 5,
      isOwn: true
    },
    {
      id: 3,
      title: "Forest Path in Autumn",
      description: "A winding path through vibrant fall foliage",
      author: {
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&q=80"
      },
      date: "2024-03-18T16:45:00Z",
      originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=600&h=400&fit=crop&q=80",
      colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=600&h=400&fit=crop&q=80",
      rating: 5,
      isOwn: true
    },
    {
      id: 4,
      title: "City Streets at Night",
      description: "Urban landscape illuminated by city lights",
      author: {
        name: "Alice Brown",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&q=80"
      },
      date: "2024-03-17T09:30:00Z",
      originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=600&h=400&fit=crop&q=80",
      colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=600&h=400&fit=crop&q=80",
      rating: 4,
      isOwn: false
    },
    {
      id: 5,
      title: "Autumn Colors in the Park",
      description: "A peaceful park scene with vibrant fall colors",
      author: {
        name: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&q=80"
      },
      date: "2024-03-16T14:20:00Z",
      originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=600&h=400&fit=crop&q=80",
      colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=600&h=400&fit=crop&q=80",
      rating: 5,
      isOwn: true
    }
  ]

  const myItems = allItems.filter(item => item.isOwn)
  
  const loadMore = () => {
    setVisibleItems(prev => prev + 3)
  }

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

  const handleShare = async (item: typeof allItems[0]) => {
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
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      })
    }
  }

  const GalleryContent = ({ items }: { items: typeof allItems }) => {
    const displayedItems = items.slice(0, visibleItems)
    const hasMore = items.length > displayedItems.length

    return (
      <div className="space-y-8">
        {displayedItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.author.avatar} alt={item.author.name} />
                      <AvatarFallback>{item.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">by {item.author.name}</p>
                    </div>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </time>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2">
                <div className="relative">
                  <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Original
                  </span>
                  <img
                    src={item.originalImage}
                    alt="Original"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                <div className="relative">
                  <span className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    Colorized
                  </span>
                  <img
                    src={item.colorizedImage}
                    alt="Colorized"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
              
              <div className="p-6 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < item.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(item.colorizedImage, item.title)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(item)}
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/gallery/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {hasMore && (
          <div className="flex justify-center py-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={loadMore}
              className="min-w-[200px]"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => {
        setActiveTab(value)
        setVisibleItems(3) // Reset visible items when switching tabs
      }}>
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-bold mb-6">Gallery</h1>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="all">All Images</TabsTrigger>
            <TabsTrigger value="my">My Images</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="h-[calc(100vh-250px)]">
          <TabsContent value="all" className="m-0">
            <GalleryContent items={allItems} />
          </TabsContent>
          <TabsContent value="my" className="m-0">
            <GalleryContent items={myItems} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </main>
  )
}