import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <Hero />
      <ProductGrid />
    </div>
  );
}
