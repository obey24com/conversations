import type { Metadata } from "next";
import { SharedMessageContent } from "./shared-message-content";

export const metadata: Metadata = {
  title: "Shared Translation | ULOCAT",
  description: "View this shared translation and start translating your own messages with ULOCAT.",
};

interface SharedMessagePageProps {
  params: {
    id: string;
  };
}

export default function SharedMessagePage({ params }: SharedMessagePageProps) {
  return <SharedMessageContent params={params} />;
}
