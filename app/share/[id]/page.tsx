import type { Metadata } from "next";
import { SharedMessageContent } from "./shared-message-content";
import { getSharedMessage } from "@/lib/firebase/messages";

interface SharedMessagePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SharedMessagePageProps): Promise<Metadata> {
  try {
    const message = await getSharedMessage(params.id);
    if (!message) {
      return {
        title: "Shared Translation | ULOCAT",
        description: "View this shared translation and start translating your own messages with ULOCAT.",
        openGraph: {
          type: "website",
          title: "ULOCAT Translation",
          description: "View this shared translation",
        },
        twitter: {
          card: "summary",
          title: "ULOCAT Translation",
          description: "View this shared translation",
        },
      };
    }

    const title = `${message.fromLang} to ${message.toLang} Translation | ULOCAT`;
    const description = message.translation;

    return {
      title,
      description,
      openGraph: {
        type: "website",
        title,
        description,
        images: message.previewImage ? [
          {
            url: message.previewImage,
            width: 1200,
            height: 630,
            alt: "Translation preview"
          }
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: message.previewImage ? [message.previewImage] : undefined,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Shared Translation | ULOCAT",
      description: "View this shared translation and start translating your own messages with ULOCAT."
    };
  }
}

export default function SharedMessagePage({ params }: SharedMessagePageProps) {
  return <SharedMessageContent params={params} />;
}
