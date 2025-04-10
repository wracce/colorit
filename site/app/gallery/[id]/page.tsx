import { GalleryItem } from "./components/gallery-item"

// This needs to be a Server Component export
export function generateStaticParams() {
  // For now, we'll generate static pages for a fixed set of IDs
  // In a real app, this would fetch IDs from your database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ]
}

export default function GalleryItemPage({ params }: { params: { id: string } }) {
  // This is sample data - in a real app, you'd fetch this based on the ID
  const item = {
    id: params.id,
    title: "Mountain Lake at Sunset",
    description: "A serene mountain lake captured during the golden hour",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&q=80"
    },
    date: "2024-03-20T14:30:00Z",
    originalImage: "https://images.unsplash.com/photo-1598411072028-c4642d98352c?w=1200&h=800&fit=crop&q=80",
    colorizedImage: "https://images.unsplash.com/photo-1682687220742-aba19b51f36e?w=1200&h=800&fit=crop&q=80",
    rating: 4,
    processingTime: "2.3 seconds",
    aiModel: "ColorizeAI v2.0",
    quality: "High"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <GalleryItem item={item} />
    </div>
  )
}