import Link from 'next/link';

const fallbackImage = '/assets/images/recipe-placeholder.svg';

type ContentCardProps = {
  href: string;
  image: string;
  title: string;
  category: string;
  description: string;
  meta: React.ReactNode;
};

export function ContentCard({ href, image, title, category, description, meta }: ContentCardProps) {
  return (
    <article className="card h-full">
      <Link href={href} className="flex h-full flex-col">
        <div className="overflow-hidden">
          <img
            className="h-[235px] w-full object-cover"
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="chip">{category}</span>
          <h3 className="mt-[10px] mb-[8px] line-clamp-2 font-['Playfair_Display'] text-[22px] leading-[1.18]">
            {title}
          </h3>
          <p className="line-clamp-2 text-[14px] text-[#565a52]">{description}</p>
          <div className="mt-4 flex flex-wrap gap-x-[12px] border-t border-[#f0ede8] pt-4 text-[12px] text-[#74776f]">
            {meta}
          </div>
        </div>
      </Link>
    </article>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  href: string;
};

export function SectionHeader({ eyebrow, title, href }: SectionHeaderProps) {
  return (
    <div className="mb-[30px] flex items-end justify-between">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-['Playfair_Display'] text-[clamp(30px,4vw,48px)]">{title}</h2>
      </div>
      <Link className="font-bold text-[#78966c]" href={href}>
        Xem tất cả →
      </Link>
    </div>
  );
}
