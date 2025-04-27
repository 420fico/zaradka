"use client";

import Link from "next/link";
import Image from "next/image";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Кнопка назад */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition text-2xl shadow-md"
          >
            ←
          </Link>
        </div>

        {/* Блок: Заголовок */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">🚚 Условия доставки</h1>
          <p className="text-lg text-gray-300">
            Узнайте о способах доставки, самовывозе и возможностях быстрой доставки по Москве и России.
          </p>
        </section>

        {/* Блок: Информация о доставке */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Доставка</h2>

          <div className="space-y-3 text-lg">
            <p>
              📦 Доставка в пределах МКАД — от <span className="text-blue-400 font-semibold">3.5 часов</span> после оформления заказа.  
              Стоимость: <span className="text-blue-400 font-semibold">от 350 ₽</span>.
            </p>

            <p>
              📦 Доставка по России — <span className="text-blue-400 font-semibold">от 1 до 3 дней</span>.  
              Стоимость: <span className="text-blue-400 font-semibold">от 250 ₽</span>.
            </p>

            <p>
              🚀 Экспресс - Доставка в пределах Москвы  —   <span className="text-blue-400 font-semibold">2 часа</span>.  
              Стоимость: <span className="text-blue-400 font-semibold">500 ₽</span>.
            </p>
          </div>
        </section>

        {/* Блок: Самовывоз */}
        <section className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-center">🏢 Самовывоз</h2>

          <p className="text-lg text-center">
            📍 Адрес:  
            <span className="text-blue-400 font-semibold"> Автозаводская ул., 36, микрорайон Железнодорожный, Балашиха</span>
          </p>

          {/* Карта */}
          <div className="flex justify-center">
            <Image
              src="/pickup-location.png" // твоя картинка карты
              alt="Карта самовывоза"
              width={160}
              height={120}
              className="rounded-2xl object-cover shadow-lg"
            />
          </div>

          {/* Ссылка на Яндекс.Карту */}
          <div className="text-center mt-4">
            <a
              href="https://yandex.ru/maps/10716/balashiha/house/avtozavodskaya_ulitsa_36/Z0EYdgZhQEYEQFtvfXtzdnlkYw==/?ll=38.028828%2C55.727292&z=15.2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-lg"
            >
              Открыть на Яндекс.Карте →
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
