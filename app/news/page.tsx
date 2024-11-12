import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: 'Translation & Language News',
  description: 'Stay updated with the latest developments in AI translation, language learning, and cultural exchange. Discover how technology is breaking down language barriers.',
};

export default function NewsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest in Translation & Language</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>The Evolution of AI Translation</CardTitle>
            <CardDescription>How artificial intelligence is revolutionizing language translation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Explore how AI is transforming the way we communicate across languages, from neural networks to contextual understanding...</p>
            <Link href="/news/ai-translation">
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Language Learning in the Digital Age</CardTitle>
            <CardDescription>Modern approaches to mastering new languages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discover how technology and AI are creating new opportunities for language learning and cultural exchange...</p>
            <Link href="/news/language-learning">
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Breaking Cultural Barriers</CardTitle>
            <CardDescription>The importance of cultural context in translation</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Understanding how cultural nuances affect communication and why context matters in translation...</p>
            <Link href="/news/cultural-exchange">
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Experience Natural Language Translation</h2>
        <p className="mb-6 text-muted-foreground">Try ULOCAT&apos;s AI-powered translation for seamless communication across languages</p>
        <Link href="/">
          <Button size="lg" className="animate-pulse">
            Start Translating Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </main>
  );
}
