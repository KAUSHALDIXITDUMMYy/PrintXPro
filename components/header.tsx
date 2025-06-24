"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/firebase/auth-context"
import { useCart } from "@/lib/hooks/use-cart"
import { checkIsAdmin } from "@/lib/firebase/admin"
import { Search, ShoppingCart, Menu, User, LogOut, Heart, Package, Settings } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await checkIsAdmin(user.uid)
          setIsAdmin(adminStatus)
        } catch (error) {
          console.error("Error checking admin status:", error)
        }
      }
    }

    checkAdminStatus()
  }, [user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-background"
      }`}
    >
      <div className="w-full">
        <div className="container mx-auto px-4 max-w-none xl:max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={`text-lg px-2 py-2 rounded-md hover:bg-accent ${
                          pathname === link.href ? "font-medium" : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}

                    {user ? (
                      <>
                        <Link
                          href="/profile"
                          className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-5 w-5" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Package className="h-5 w-5" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="h-5 w-5" />
                          Wishlist
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Settings className="h-5 w-5" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleSignOut()
                            setIsMobileMenuOpen(false)
                          }}
                          className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2 text-destructive"
                        >
                          <LogOut className="h-5 w-4" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/login"
                        className="text-lg px-2 py-2 rounded-md hover:bg-accent flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Sign In
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold">PrintXpro</span>
                <span className="text-primary">.com</span>
              </Link>

              <nav className="ml-8 hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm hover:text-primary ${pathname === link.href ? "font-medium" : ""}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="hidden md:flex relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>

              <ThemeToggle />

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.items.length}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">{user.displayName || user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Sign in</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
