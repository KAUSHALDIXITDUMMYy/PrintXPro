

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative flex min-h-[480px] flex-col gap-6 items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBGKsYJMsROXs48Ui09ElIOEB0G0LWPR3P3M56m9gJSN2_332_TJPY7eMzt6nnjVEp5kIExfDGc2lh0XMBJ0rKrlB5k9O1tBhP2Rj_cFb-S-lOXb6f8K-jJmNoT-ZXoUb2R1C6d3jgqyHJ85zdv8wFp8ai2X_0DviNNrAqUNzbOZXa1hQTmDgwyvKed7Vfk2WtGJtxEKFQMlHggWXtDl6bW83xDj4DCSp7cypRjSnv1m61ZrDmNJnXddkB83BESmzYXlwaoo8yYCZOg")'
      }}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl md:font-black md:leading-tight md:tracking-[-0.033em]">
          Discover Unique 3D Printed Decor
        </h1>
        <h2 className="text-white text-sm font-normal leading-normal md:text-base md:font-normal md:leading-normal">
          Transform your space with our curated collection of innovative designs.
        </h2>
      </div>
      <Button
        className="flex min-w-[84px] max-w-[480px] h-10 px-4 md:h-12 md:px-5 bg-[#e92932] text-white text-sm font-bold leading-normal tracking-[0.015em] md:text-base md:font-bold md:leading-normal md:tracking-[0.015em]"
        asChild
      >
        <Link href="/products">
          <span className="truncate">Shop Now</span>
        </Link>
      </Button>
    </div>
  )
}
