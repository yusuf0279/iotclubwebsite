import {
  Gallery,
  GalleryGrid,
  GalleryImage,
} from "@/components/ui/shared-element-gallery";
import { mediaPhotos } from "@/lib/media";

export const metadata = {
  title: "Media",
  description: "Photos from AUS IoT Club events, workshops and campus demonstrations.",
};

export default function MediaPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 pb-8 pt-10 md:px-10 md:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h1 className="text-[clamp(61px,13.6vw,204px)] leading-[0.85] text-text">Media</h1>
        <p className="max-w-sm pb-2 text-[18px] leading-[1.5] text-muted">
          Workshops, the club fair and campus demonstrations. Select a photo to view it full size.
        </p>
      </div>

      <section aria-label="Photo gallery" className="mt-8 md:mt-12">
        <Gallery>
          <GalleryGrid>
            {mediaPhotos.map((photo) => (
              <GalleryImage
                key={photo.id}
                id={String(photo.id)}
                src={photo.imageUrl}
                alt={photo.title}
              />
            ))}
          </GalleryGrid>
        </Gallery>
      </section>
    </div>
  );
}
