import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
      {/* Hero Section */}
      <div className="@container">
        <div className="@[480px]:p-4">
          <div
            className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("/hero-bg.jpg")`,
            }}
          >
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                Discover Unique 3D Printed Decor
              </h1>
              <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base">
                Transform your space with our curated collection of innovative designs.
              </h2>
            </div>
            <Link
              href="/shop"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#e92932] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Featured Items
      </h2>
      <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 gap-3">
          {[
            {
              image: "/featured-1.jpg",
              title: "Modern Geometric Vase",
              description: "Add a touch of elegance to your home.",
            },
            {
              image: "/featured-2.jpg",
              title: "Abstract Art Sculpture",
              description: "A statement piece for any room.",
            },
            {
              image: "/featured-3.jpg",
              title: "Ambient Light Lamp",
              description: "Create a cozy atmosphere.",
            },
          ].map((item) => (
            <div key={item.title} className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div>
                <p className="text-[#181111] text-base font-medium leading-normal">{item.title}</p>
                <p className="text-[#886364] text-sm font-normal leading-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        New Arrivals
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {[
          {
            image: "/new-1.jpg",
            title: "Minimalist Planter",
            description: "Perfect for small plants.",
          },
          {
            image: "/new-2.jpg",
            title: "Textured Wall Panel",
            description: "Enhance your wall decor.",
          },
          {
            image: "/new-3.jpg",
            title: "Art Deco Coasters",
            description: "Set of 4 unique designs.",
          },
          {
            image: "/new-4.jpg",
            title: "Sculptural Bookends",
            description: "Keep your books in style.",
          },
        ].map((item) => (
          <div key={item.title} className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{ backgroundImage: `url(${item.image})` }}
            />
            <div>
              <p className="text-[#181111] text-base font-medium leading-normal">{item.title}</p>
              <p className="text-[#886364] text-sm font-normal leading-normal">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Special Offers */}
      <h2 className="text-[#181111] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Special Offers
      </h2>
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-lg @xl:flex-row @xl:items-start">
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
            style={{ backgroundImage: `url("/special-offer.jpg")` }}
          />
          <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
            <p className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em]">
              Limited Time Offer
            </p>
            <div className="flex items-end gap-3 justify-between">
              <p className="text-[#886364] text-base font-normal leading-normal">
                Get 20% off on all vases. Use code DECOR20 at checkout.
              </p>
              <Link
                href="/shop"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#e92932] text-white text-sm font-medium leading-normal"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
