import Link from "next/link";

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#121621] text-[#A0B3D6] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Links */}
        <div className="flex justify-center gap-8 mb-8">
          <Link
            href="/about"
            className="text-[#A0B3D6] hover:text-white transition-colors text-sm font-medium"
          >
            About
          </Link>
          <Link
            href="/faq"
            className="text-[#A0B3D6] hover:text-white transition-colors text-sm font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/support"
            className="text-[#A0B3D6] hover:text-white transition-colors text-sm font-medium"
          >
            Support
          </Link>
          <Link
            href="/privacy"
            className="text-[#A0B3D6] hover:text-white transition-colors text-sm font-medium"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-[#A0B3D6] hover:text-white transition-colors text-sm font-medium"
          >
            Terms
          </Link>
        </div>

        {/* Separator Line */}
        <div className="border-t border-[#A0B3D6]/30 mb-8"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#A0B3D6] text-sm">
            © {currentYear} OnlyHockey, LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
