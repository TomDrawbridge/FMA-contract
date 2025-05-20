import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-white py-4 px-4 md:px-6 border-b">
      <div className="max-w-7xl mx-auto flex justify-center">
        <Link href="/" className="flex items-center">
          <Image
            src="https://www.fm-academy.co.uk/wp-content/themes/fma/library/images/branding/logo.png"
            alt="FMA Academy Logo"
            width={180}
            height={54} // Maintaining aspect ratio
            priority
            className="h-auto w-[180px]"
          />
        </Link>
      </div>
    </header>
  )
}
