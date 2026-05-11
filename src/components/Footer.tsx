export function Footer() {
  return (
    <footer className="border-t border-[#f1f1f1] px-5 pt-5 pb-8">
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <p className="text-[20px] font-black text-[#222] leading-none">Parcel.</p>

        {/* Created by */}
        <p className="text-[12px] font-medium text-[#777] tracking-[-0.24px] leading-[1.6]">
          Created by{" "}
          <a
            href="https://rahulrn.framer.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#222] underline underline-offset-2"
          >
            Rahul R Nadkarni
          </a>
        </p>

        {/* Social */}
        <div>
          <p className="text-[12px] font-medium text-[#777] tracking-[-0.24px] leading-[1.6] mb-2">
            Let&apos;s get in touch
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/rahul-r-nadkarni/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[12px] text-[#222] hover:opacity-70 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Linkedin.svg" width={14} height={14} alt="" />
              LinkedIn
            </a>
            <a
              href="https://instagram.com/rahulrnadkarni"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[12px] text-[#222] hover:opacity-70 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/Instagram.svg" width={14} height={14} alt="" />
              Instagram
            </a>
            <a
              href="https://x.com/rahulrnadkarni"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[12px] text-[#222] hover:opacity-70 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/X (twitter).svg" width={14} height={14} alt="" />
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
