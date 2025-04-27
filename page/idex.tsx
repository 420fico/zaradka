// pages/index.tsx
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold p-4">Товары Acer</h1>
      <ProductGrid />
    </div>
  );
}
