import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10" />

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-6">
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

          <div className="flex-1 relative h-[300px] md:h-[400px] w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-foreground rounded-full opacity-20 blur-xl" />
                <div className="absolute inset-4 bg-card rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 md:w-48 md:h-48 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary rounded-lg transform rotate-45" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-primary rounded-lg transform rotate-12" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-primary/80 to-primary rounded-lg transform -rotate-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
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
  )
}
