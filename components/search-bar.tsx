"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  initialValue?: string
}

export function SearchBar({ initialValue = "" }: SearchBarProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialValue)

  useEffect(() => {
    setSearch(initialValue)
  }, [initialValue])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    } else {
      router.push("/products")
    }
  }

  const clearSearch = () => {
    setSearch("")
    router.push("/products")
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex w-full flex-1 items-stretch rounded-lg h-10">
        <div className="text-[#886364] flex border-none bg-[#f4f0f0] items-center justify-center pl-4 rounded-l-lg border-r-0">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#181111] focus:outline-0 focus:ring-0 border-none bg-[#f4f0f0] focus:border-none h-full placeholder:text-[#886364] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-[#886364] flex border-none bg-[#f4f0f0] items-center justify-center pr-4 rounded-r-lg border-l-0"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  )
}