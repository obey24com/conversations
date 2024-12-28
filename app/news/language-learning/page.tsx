import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: 'Language Learning in the Digital Age',
  description: 'Discover how technology and AI are transforming language learning, making it more accessible and effective than ever before.',
};

export default function LanguageLearningPage() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Language Learning in the Digital Age</h1>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Technology-Enhanced Learning</h2>
        <p className="mb-4">
          The digital revolution has transformed how we learn languages. AI-powered tools, mobile apps, and online platforms have made language learning more accessible, personalized, and engaging than ever before.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Personalized Learning Paths</h2>
        <p className="mb-4">
          Modern language learning platforms use AI to adapt to individual learning styles and pace. These systems analyze performance, identify areas for improvement, and create customized learning experiences for each user.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Immersive Learning Experiences</h2>
        <p className="mb-4">
          Virtual reality and augmented reality technologies are creating immersive environments for language practice. These tools simulate real-world scenarios, allowing learners to practice their skills in context-rich situations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">The Role of AI Translation</h2>
        <p className="mb-4">
          AI translation tools serve as valuable learning aids, helping students understand complex texts and providing immediate feedback. They bridge the gap between formal learning and practical application, making the learning process more efficient.
        </p>

        <div className="mt-12 text-center bg-muted p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Enhance Your Language Learning</h3>
          <p className="mb-6">Use ULOCAT&apos;s AI translation to support your language learning journey</p>
          <Link href="/">
            <Button size="lg">
              Start Learning Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
