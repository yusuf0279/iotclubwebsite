import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allNews } from "@/lib/news";
import { formatNewsDate } from "@/lib/format";

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const item = allNews.find((news) => news.id.toString() === id);
  if (!item) return { title: "Not found" };
  return {
    title: item.title.trim(),
    description: item.bio.trim() || `${item.tag} from the AUS IoT Club, ${formatNewsDate(item.date)}.`,
  };
}

export default async function NewsDetailPage({ params }: Params) {
  const { id } = await params;
  const item = allNews.find((news) => news.id.toString() === id);

  if (!item) {
    notFound();
  }

  const description = item.bio.trim();

  return (
    <article className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-10 md:pt-14">
      <Link href="/news" className="inline-block text-[18px] font-semibold text-accent hover:underline">
        ← All news
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[5fr_7fr] md:gap-16">
        <Image
          src={item.image}
          alt={item.title.trim()}
          width={1200}
          height={1500}
          priority
          sizes="(min-width: 768px) 40vw, 100vw"
          className="aspect-[4/5] w-full bg-surface object-contain md:sticky md:top-10 md:self-start"
        />

        <div>
          <p className="text-[16px] font-medium text-accent">
            {item.tag} · {formatNewsDate(item.date)} · {item.readTime}
          </p>
          <h1 className="mt-4 text-[clamp(48px,8vw,128px)] leading-[0.92] text-text">
            {item.title.trim()}
          </h1>
          {description && (
            <p className="mt-10 max-w-2xl text-[clamp(20px,2vw,26px)] leading-[1.5] text-text">
              {description}
            </p>
          )}
          <p className="mt-10 text-[16px] text-muted">Posted by {item.author}.</p>
        </div>
      </div>
    </article>
  );
}
