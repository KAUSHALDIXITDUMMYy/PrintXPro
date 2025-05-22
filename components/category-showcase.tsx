import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCategories } from "@/lib/firebase/products"
import { CuboidIcon as Cube, Palette, Gift, Cog, Lightbulb } from "lucide-react"

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Toys: <Gift className="h-6 w-6" />,
  Decor: <Palette className="h-6 w-6" />,
  Industrial: <Cog className="h-6 w-6" />,
  Personalized: <Lightbulb className="h-6 w-6" />,
  default: <Cube className="h-6 w-6" />,
}

export async function CategoryShowcase() {
  let categories = []

  try {
    categories = await getCategories()
  } catch (error) {
    console.error("Error getting categories:", error)
    // Return placeholder categories if there's an error
    categories = [
      { name: "Toys", count: 0 },
      { name: "Decor", count: 0 },
      { name: "Industrial", count: 0 },
      { name: "Personalized", count: 0 },
    ]
  }

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.name} href={`/products?category=${encodeURIComponent(category.name)}`} className="group">
            <div className="bg-card rounded-lg p-6 text-center h-full flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {CATEGORY_ICONS[category.name] || CATEGORY_ICONS.default}
              </div>
              <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category.count} products</p>
              <Button variant="outline" size="sm" className="mt-auto">
                Explore
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
