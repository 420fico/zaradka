"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Image from "next/image";

const categories = [
  { name: "Apple", file: "apple_chargers.json", logo: "/brands/apple.png" },
  { name: "Acer", file: "acer_chargers.json", logo: "/brands/acer.png" },
  { name: "Samsung", file: "samsung_chargers.json", logo: "/brands/samsung.png" },
  { name: "Compaq", file: "compaq_chargers.json", logo: "/brands/compaq.png" },
  { name: "Dell", file: "dell_chargers.json", logo: "/brands/dell.png" },
  { name: "eMachines", file: "emachines_chargers.json", logo: "/brands/emachines.png" },
  { name: "Haier", file: "haier_chargers.json", logo: "/brands/haier.png" },
  { name: "Lenovo", file: "lenovo_chargers.json", logo: "/brands/lenovo.png" },
  { name: "MSI", file: "msi_chargers.json", logo: "/brands/msi.png" },
  { name: "Microsoft", file: "microsoft_chargers.json", logo: "/brands/microsoft.png" },
  { name: "Sony", file: "sony_chargers.json", logo: "/brands/sony.png" },
  { name: "Toshiba", file: "toshiba_chargers.json", logo: "/brands/toshiba.png" },
];
interface Product {
  title: string;
  price: string;
  image: string;
  specs?: { [key: string]: string };
}
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    async function fetchProducts() {
      if (!selectedCategory) return;

      const selected = categories.find((c) => c.name === selectedCategory);
      if (selected) {
        const res = await fetch(`/data/${selected.file}`);
        const data = await res.json();
        // Увеличиваем цену на 40%
const updatedData = data.map((item: any) => ({
  ...item,
  price: item.price
    ? `${Math.round(parseFloat(item.price.replace(/[^\d.]/g, "")) * 1.4)} ₽`
    : item.price,
}));
setProducts(updatedData);

      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setIsSending(true);
  
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, message }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setName("");
        setContact("");
        setMessage("");
        setSelectedProduct(null);
        setSuccess(true);
      } else {
        throw new Error(data.error || "Неизвестная ошибка");
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleHomeClick = () => {
    setSelectedCategory(null);
    setProducts([]);
    setSelectedProduct(null);
  };

  const handleOrder = (item: any) => {
    setSelectedProduct(item);
    setMessage(`Хочу заказать: ${item.title}`);
    setIsModalOpen(true);
  };
  

  return (
    <>
      <Header onHomeClick={handleHomeClick} />

      <main className="p-8 min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">Магазин зарядных устройств</h1>

        {/* Бренды */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-10">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`cursor-pointer flex flex-col items-center justify-center p-4 bg-gray-800 rounded-2xl hover:bg-gray-700 transition transform hover:scale-105 ${
                selectedCategory === cat.name ? "ring-4 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <Image src={cat.logo} alt={cat.name} width={80} height={80} className="object-contain" />
              </div>
              <span className="text-sm font-semibold mt-3 text-center">{cat.name}</span>
            </div>
          ))}
        </div>

        {/* Товары */}
        {selectedCategory && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
           {products.map((item, index) => {
              const isOriginal = item.specs && Object.values(item.specs).some(value =>
                typeof value === "string" && value.toLowerCase().includes("оригинал")
              );

              return (
                <div
                  key={index}
                  className="relative border border-gray-700 rounded-2xl overflow-hidden shadow hover:shadow-lg transition group bg-gray-800 flex flex-col justify-between"
                >
                  {/* Картинка товара */}
                  <div className="relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-[250px] object-cover rounded-t-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent transition-all duration-500">
                      <h2 className="text-white text-lg font-semibold text-center px-4 opacity-0 group-hover:opacity-100 backdrop-blur-sm bg-black/30 p-2 rounded-xl transition-all duration-500">
                        {item.title}
                      </h2>
                    </div>
                    {isOriginal && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                        ©️ Оригинал
                      </div>
                    )}
                  </div>

                  {/* Характеристики */}
                  <div className="p-4 text-sm flex-1">
                    {item.specs && Object.entries(item.specs).map(([key, value], idx) => (
                      <div key={idx} className="flex justify-between py-1 border-b border-gray-700">
                        <span className="text-gray-400">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Кнопка заказать */}
                  <div className="p-4">
                    <button
                      onClick={() => handleOrder(item)}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-bold text-white"
                    >
                      Заказать
                    </button>
                  </div>
                </div>
              );
            })}
    
          </div>
        )}

        {/* Форма заявки */}
        <section className="max-w-2xl mx-auto mt-16 bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Оставить заявку</h2>

          {success && (
            <div className="mb-6 text-green-400 font-semibold text-center">
              ✅ Заявка успешно отправлена!
            </div>
          )}

          {/* Если выбран товар — показываем краткое описание */}
          {selectedProduct && (
            <div className="mb-6 flex items-center gap-4 bg-gray-700 p-4 rounded-xl">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                width={80}
                height={80}
                className="rounded-xl object-cover"
              />
              <div>
                <div className="font-bold">{selectedProduct.title}</div>
                {selectedProduct.price && (
                  <div className="text-blue-400 font-semibold mt-1">{selectedProduct.price}</div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={sendForm} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите имя"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Телефон или email</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ваш телефон или почта"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Комментарий</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Введите сообщение"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-bold text-white disabled:bg-gray-600"
            >
              {isSending ? "Отправка..." : "Отправить заявку"}
            </button>
          </form>
        </section>
        {isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full relative">
      
      {/* Кнопка закрытия */}
      <button
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
      >
        ×
      </button>

      {/* Заголовок */}
      <h2 className="text-3xl font-bold mb-6 text-center">Оставить заявку</h2>

      {/* Выбранный товар */}
      {selectedProduct && (
        <div className="mb-6 flex items-center gap-4 bg-gray-700 p-4 rounded-xl">
          <Image
            src={selectedProduct.image}
            alt={selectedProduct.title}
            width={80}
            height={80}
            className="rounded-xl object-cover"
          />
          <div>
            <div className="font-bold">{selectedProduct.title}</div>
            {selectedProduct.price && (
              <div className="text-blue-400 font-semibold mt-1">{selectedProduct.price}</div>
            )}
          </div>
        </div>
      )}

      {/* Форма */}
      <form onSubmit={sendForm} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите имя"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Телефон или email</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ваш телефон или почта"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Комментарий</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Введите сообщение"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-bold text-white disabled:bg-gray-600"
        >
          {isSending ? "Отправка..." : "Отправить заявку"}
        </button>

        {success && (
          <div className="mt-4 text-green-400 font-semibold text-center">
            ✅ Заявка успешно отправлена!
          </div>
        )}
      </form>
    </div>
  </div>
)}
      </main>
    </>
  );
}
