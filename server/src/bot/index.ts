import { Bot } from 'grammy';
import dotenv from 'dotenv';

dotenv.config();

const botToken = process.env.BOT_TOKEN?.trim();
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';
const bot = botToken ? new Bot(botToken) : null;

if (bot) {
  bot.command('start', async (ctx) => {
    const user = ctx.from;

    await ctx.reply(
      `Assalomu alaykum, ${user?.first_name || 'hurmatli mijoz'}!\n\n` +
      `PaketShop.uz qadoqlash mahsulotlari do'koniga xush kelibsiz.\n\n` +
      `Xarid qilish uchun quyidagi tugmadan foydalaning:`,
      {
        reply_markup: {
          inline_keyboard: [[
            {
              text: "Do'konni ochish",
              url: 'https://paketshop.uz',
            },
          ]],
        },
      }
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(
      "/start - do'konni ochish\n" +
      '/help - yordam\n' +
      "/contact - aloqa ma'lumotlari\n\n" +
      'Savollar uchun: @paketshop_support'
    );
  });

  bot.command('contact', async (ctx) => {
    await ctx.reply(
      'Telefon: +998 90 123 45 67\n' +
      'Email: info@paketshop.uz\n' +
      'Manzil: Toshkent sh.\n' +
      'Ish vaqti: 09:00 - 18:00'
    );
  });

  bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('confirm_')) {
      await ctx.editMessageText(
        `${ctx.callbackQuery.message?.text || ''}\n\nTASDIQLANDI`
      );
      await ctx.answerCallbackQuery({ text: 'Buyurtma tasdiqlandi!' });
      return;
    }

    if (data.startsWith('cancel_')) {
      await ctx.editMessageText(
        `${ctx.callbackQuery.message?.text || ''}\n\nBEKOR QILINDI`
      );
      await ctx.answerCallbackQuery({ text: 'Buyurtma bekor qilindi!' });
    }
  });
}

export async function sendOrderNotification(order: any) {
  if (!bot || !ADMIN_CHAT_ID) {
    console.log('Bot token yoki admin chat ID topilmadi, notification yuborilmadi');
    return;
  }

  const itemsList = order.items
    .map((item: any) => `- ${item.name} x${item.quantity} - ${item.price * item.quantity} so'm`)
    .join('\n');

  const customerName = order.customerName || "Noma'lum";
  const message =
    'YANGI BUYURTMA\n\n' +
    `Buyurtma: ${order.id}\n` +
    `Mijoz: ${customerName}\n` +
    `Telefon: ${order.phone}\n` +
    `Manzil: ${order.address}\n` +
    `To'lov: ${order.paymentMethod}\n\n` +
    `Mahsulotlar:\n${itemsList}\n\n` +
    `Jami: ${order.total} so'm\n` +
    `${order.comment ? `\nIzoh: ${order.comment}` : ''}`;

  try {
    await bot.api.sendMessage(ADMIN_CHAT_ID, message, {
      reply_markup: {
        inline_keyboard: [[
          { text: 'Tasdiqlash', callback_data: `confirm_${order.id}` },
          { text: 'Bekor qilish', callback_data: `cancel_${order.id}` },
        ]],
      },
    });
  } catch (error) {
    console.error('Failed to send order notification:', error);
  }
}

export async function startBot() {
  if (!bot) {
    console.log('BOT_TOKEN not set, bot startup skipped');
    return;
  }

  if (process.env.WEBHOOK_URL) {
    const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`;
    await bot.api.setWebhook(webhookUrl);
    console.log('Bot webhook set:', webhookUrl);
    return;
  }

  bot.start();
  console.log('Bot started in polling mode');
}

export { bot };
