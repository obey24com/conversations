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
            <CardTitle>The Evolution of Translation: From Ancient Scripts to AI</CardTitle>
            <CardDescription>Journey through the history of translation technology</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">From ancient scribes to modern AI, discover the fascinating journey of how we&apos;ve broken down language barriers throughout history...</p>
            <Link href="/news/translation-evolution">
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>AI Translation: The Future of Global Communication</CardTitle>
            <CardDescription>Revolutionizing how we connect across languages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Discover how artificial intelligence is revolutionizing language translation and reshaping global communication...</p>
            <Link href="/news/ai-translation-future">
              <Button variant="outline" className="w-full">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Deep Talk Translation: Beyond Words</CardTitle>
            <CardDescription>Understanding emotions and cultural context</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Experience translation that understands not just your words, but the emotions and cultural nuances behind them...</p>
            <Link href="/news/deep-talk-translation">
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
