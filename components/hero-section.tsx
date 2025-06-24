import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />

      <div className="w-full">
        <div className="container mx-auto px-4 max-w-none xl:max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6 z-10 relative">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Custom 3D Printed <span className="text-primary">Masterpieces</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Transform your ideas into reality with our premium 3D printing services. From decorative pieces to
                functional prototypes, we bring your vision to life.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link href="/custom">Custom Order</Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 relative h-[300px] md:h-[400px] w-full order-first md:order-last">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 animate-float">
                  {/* Background blur effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-foreground rounded-full opacity-20 blur-xl" />

                  {/* Main container */}
                  <div className="absolute inset-2 md:inset-4 bg-card rounded-full shadow-lg" />

                  {/* 3D shapes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 relative">
                      {/* Multiple rotating shapes for 3D effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary rounded-lg transform rotate-45 shadow-lg" />
                      <div className="absolute inset-1 md:inset-2 bg-gradient-to-tr from-primary/70 to-primary/90 rounded-lg transform rotate-12 shadow-md" />
                      <div className="absolute inset-2 md:inset-4 bg-gradient-to-tl from-primary/60 to-primary/80 rounded-lg transform -rotate-12 shadow-sm" />

                      {/* Center highlight */}
                      <div className="absolute inset-1/4 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10">
            <div className="bg-card p-4 rounded-lg shadow-sm text-center">
              <div className="font-bold text-2xl">100+</div>
              <div className="text-sm text-muted-foreground">Designs</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm text-center">
              <div className="font-bold text-2xl">5K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm text-center">
              <div className="font-bold text-2xl">99%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-sm text-center">
              <div className="font-bold text-2xl">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
