import { Button } from "@/components/ui/button";
import { ArrowRight, Image, History, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Bring Your Black & White Photos to Life
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Transform your monochrome memories into vibrant, colorful masterpieces using our advanced AI technology.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/colorize">
            <Button size="lg">
              Start Colorizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="outline" size="lg">
              View Gallery
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Image className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Instant Colorization</h3>
            <p className="mt-2 text-muted-foreground">
              Upload your black & white photos and get colorized results in seconds.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <History className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Track History</h3>
            <p className="mt-2 text-muted-foreground">
              Access all your previously colorized images in one place.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Rate Results</h3>
            <p className="mt-2 text-muted-foreground">
              Share your feedback and help us improve our colorization algorithm.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}