import type { Metadata } from "next";
import { SharedMessageContent } from "./shared-message-content";
import { getSharedMessage } from "@/lib/firebase/messages";
import type { SharedMessage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shared Translation | ULOCAT",
  description: "View this shared translation and start translating your own messages with ULOCAT.",
};

interface SharedMessagePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SharedMessagePageProps) {
  try {
    const message = await getSharedMessage(params.id);
    if (!message) return {};

    return {
      title: "Shared Translation | ULOCAT",
      description: `Translation from ${message.fromLang} to ${message.toLang}`,
      openGraph: {
        title: "ULOCAT Translation",
        description: message.translation,
        images: message.previewImage ? [{ url: message.previewImage }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: "ULOCAT Translation",
        description: message.translation,
        images: message.previewImage ? [message.previewImage] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {};
  }
}

export default function SharedMessagePage({ params }: SharedMessagePageProps) {
  return <SharedMessageContent params={params} />;
}
