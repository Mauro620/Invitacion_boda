import Link from "next/link";
import { wedding } from "@/content/wedding";

export default function Home() {
  return (
    <main className="grid min-h-dvh place-items-center p-gutter text-center">
      <p>
        {wedding.envelope.line}{" "}
        <Link href="/styleguide" className="text-accent underline underline-offset-4">
          Styleguide
        </Link>
      </p>
    </main>
  );
}
