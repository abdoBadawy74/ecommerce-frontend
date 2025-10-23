import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import ProductCard from "../components/ProductCard"
import HeroSection from "../components/Hero"
import { u } from "framer-motion/client"

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*")
      setProducts(data || [])
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <HeroSection />
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
