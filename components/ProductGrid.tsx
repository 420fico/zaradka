// components/ProductGrid.tsx
import Image from 'next/image';
import Link from 'next/link';
import { products } from '../data/products';

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product, index) => (
        <Link href={product.link} key={index} passHref>
          <a className="block border rounded-xl shadow-lg p-4 hover:shadow-2xl transition">
            <div className="relative w-full h-48 mb-4">
              <Image src={product.image} alt={product.title} layout="fill" objectFit="contain" />
            </div>
            <h3 className="text-lg font-medium">{product.title}</h3>
          </a>
        </Link>
      ))}
    </div>
  );
}
