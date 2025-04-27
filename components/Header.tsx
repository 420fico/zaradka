"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-gray-800 text-white shadow-md py-4 px-8 flex items-center justify-between flex-wrap">
      {/* Логотип + название */}
      <div
        onClick={() => router.push("/")}
        className="flex items-center cursor-pointer space-x-3"
      >
   
        <span className="text-2xl font-bold">
          Charger<span className="text-blue-400">Store</span>
        </span>
      </div>

      {/* Навигация + телефон */}
      <div className="flex items-center space-x-8">
        <nav className="space-x-6">
          <Link href="/delivery" className="hover:text-blue-400 transition">
            Доставка
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition">
            О нас
          </Link>
        </nav>

        <a
          href="tel:88005553535"
          className="text-lg font-semibold text-blue-400 hover:underline"
        >
          8-800-555-35-35
        </a>
      </div>
    </header>
  );
}
