import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Zap, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About <span className="text-primary">PrintXpro</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          We're passionate about bringing your ideas to life through cutting-edge 3D printing technology. Since our
          founding, we've been dedicated to delivering high-quality, custom 3D printed products that exceed
          expectations.
        </p>
        <div className="relative w-full max-w-4xl mx-auto h-64 md:h-96 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=400&width=800" alt="PrintXpro Workshop" fill className="object-cover" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To democratize manufacturing by making high-quality 3D printing accessible to everyone. We believe that
              great ideas shouldn't be limited by traditional manufacturing constraints.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Quality craftsmanship in every print</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Sustainable and eco-friendly materials</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Customer satisfaction guarantee</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-muted-foreground mb-6">
              To become the leading platform for custom 3D printing solutions, empowering creators, entrepreneurs, and
              businesses to turn their innovative concepts into reality.
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Why Choose PrintXpro?</h3>
              <p className="text-sm text-muted-foreground">
                With years of experience and state-of-the-art technology, we deliver precision, quality, and reliability
                in every project. Our team of experts ensures your vision comes to life exactly as you imagined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-muted-foreground">Numbers that speak for our commitment to excellence</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">15000+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we do</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-muted-foreground">
              We strive for perfection in every print, ensuring the highest quality standards and attention to detail in
              all our work.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-muted-foreground">
              We embrace cutting-edge technology and continuously improve our processes to deliver better solutions for
              our customers.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
            <p className="text-muted-foreground">
              Our customers are at the heart of everything we do. We listen, understand, and deliver solutions that
              exceed expectations.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground">The passionate people behind PrintXpro</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
              <Image src="/placeholder.svg?height=128&width=128" alt="CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Rajesh Kumar</h3>
            <p className="text-primary mb-2">CEO & Founder</p>
            <p className="text-sm text-muted-foreground">
              Visionary leader with 10+ years in 3D printing and manufacturing technology.
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
              <Image src="/placeholder.svg?height=128&width=128" alt="CTO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-semibold mb-1">Priya Sharma</h3>
            <p className="text-primary mb-2">CTO</p>
            <p className="text-sm text-muted-foreground">
              Technology expert specializing in advanced 3D printing techniques and materials.
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Head of Operations"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">Amit Patel</h3>
            <p className="text-primary mb-2">Head of Operations</p>
            <p className="text-sm text-muted-foreground">
              Operations specialist ensuring smooth production and timely delivery of all orders.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="bg-primary/5 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have brought their ideas to life with PrintXpro. Let's create
            something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
