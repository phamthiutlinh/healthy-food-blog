export default function Footer() {
  return (
    <footer className="mt-[70px] border-t border-[#e7e5df] py-[42px] text-[13px] text-[#74776f]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-[18px] md:flex-row md:justify-between md:px-[26px]">
        <span className="inline-flex items-center gap-2.5 font-['Playfair_Display'] text-[24px] font-bold leading-none text-[#2f342d]">
          <img className="h-10 w-10" src="/assets/images/logo-lyn-kitchen.svg" alt="" />
          <span>Nhà bếp <span className="text-[#78966c]">của Lyn</span></span>
        </span>
        <span>© 2026 · Ăn uống lành mạnh theo cách của bạn.</span>
      </div>
    </footer>
  );
}
