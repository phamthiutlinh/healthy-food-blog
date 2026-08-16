'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/recipes', label: 'Công thức' },
  { href: '/meal-prep', label: 'Meal prep' },
  { href: '/articles', label: 'Góc sống khỏe' },
  { href: '/about', label: 'Về chúng mình' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center border-b border-[#eceae4] bg-[#faf9f6]/92 backdrop-blur-[12px] md:h-[105px]">
      <div className="js-nav relative mx-auto flex w-full items-center justify-between gap-2 px-[18px] md:px-[72px]">
        <Link
          className="inline-flex min-w-0 items-center gap-2 font-['Playfair_Display'] text-[16px] font-bold leading-none md:gap-2.5 md:text-[36px]"
          href="/"
          aria-label="Nhà bếp của Lyn - Trang chủ"
        >
          <img
            className="h-9 w-9 shrink-0 md:h-11 md:w-11"
            src="/assets/images/logo-lyn-kitchen.svg"
            alt=""
          />
          <span className="whitespace-nowrap hidden xl:block">
            Nhà bếp <span className="text-[#78966c]">của Lyn</span>
          </span>
        </Link>

        <nav className="js-nav-links hidden flex-col gap-1 border-b border-[#e7e5df] bg-[#faf9f6] px-5 py-5 text-[15px] font-semibold shadow-[0_8px_24px_rgba(47,52,45,.12)] md:static md:flex md:max-h-none md:flex-row md:gap-[40px] md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-[17px] md:shadow-none">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 md:rounded-none md:px-0 md:py-0 ${
                pathname === link.href
                  ? 'text-[#78966c]'
                  : 'hover:bg-[#78966c]/10 md:hover:bg-transparent hover:text-[#78966c]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
