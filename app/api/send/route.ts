// app/api/send/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, contact, message } = await req.json();

  const TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN!;
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID!;
  
  const text = `
Новая заявка 🚀
Имя: ${name}
Контакт: ${contact}
Сообщение: ${message}
  `;

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    });

    if (!telegramRes.ok) {
      throw new Error("Ошибка отправки в Telegram");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ success: false, error: "Ошибка отправки" }, { status: 500 });
  }
}
