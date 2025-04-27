// pages/api/sendMessage.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Метод не разрешен
  }

  const { name, contact, message } = req.body;

  const TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Настройки бота не найдены." });
  }

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
      throw new Error("Ошибка отправки сообщения в Telegram");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка отправки в Telegram" });
  }
}
