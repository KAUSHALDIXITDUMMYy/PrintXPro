import Image from "next/image"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Interior Designer",
    content:
      "The quality of PrintXpro's 3D models is exceptional. I've ordered multiple custom pieces for my clients, and they're always impressed with the detail and finish.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Developer",
    content:
      "I needed rapid prototyping for my startup, and PrintXpro delivered beyond expectations. The turnaround time was quick, and the precision was spot-on.",
    rating: 5,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Hobbyist",
    content:
      "As a collector, I appreciate the attention to detail in PrintXpro's models. Their customer service is also top-notch - they helped me customize my order perfectly.",
    rating: 4,
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our customers have to say about their experience with PrintXpro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-card rounded-lg p-6 shadow-sm relative">
            <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />

            <div className="flex items-center mb-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>

            <div className="flex mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <p className="text-sm">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
