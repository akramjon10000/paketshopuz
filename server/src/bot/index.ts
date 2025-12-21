import { Bot } from 'grammy';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN || '');
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '';

// /start command
bot.command('start', async (ctx) => {
    const user = ctx.from;

    await ctx.reply(
        `🎉 *Assalomu alaykum, ${user?.first_name || 'Hurmatli mijoz'}!*\n\n` +
        `*PaketShop.uz* - Qadoqlash mahsulotlari onlayn do'koniga xush kelibsiz!\n\n` +
        `📦 Paketlar, qutilar, bir martalik idishlar va ko'proq...\n\n` +
        `👇 Xarid qilish uchun tugmani bosing:`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: '🛒 Do\'konni ochish',
                        url: 'https://paketshop.uz'
                    }
                ]]
            }
        }
    );
});

// /help command
bot.command('help', async (ctx) => {
    await ctx.reply(
        `ℹ️ *Yordam*\n\n` +
        `/start - Botni boshlash va do'konni ochish\n` +
        `/help - Yordam\n` +
        `/contact - Aloqa ma'lumotlari\n\n` +
        `Savollar uchun: @paketshop_support`,
        { parse_mode: 'Markdown' }
    );
});

// /contact command
bot.command('contact', async (ctx) => {
    await ctx.reply(
        `📞 *Aloqa ma'lumotlari*\n\n` +
        `📱 Telefon: +998 90 123 45 67\n` +
        `📧 Email: info@paketshop.uz\n` +
        `📍 Manzil: Toshkent sh.\n\n` +
        `⏰ Ish vaqti: 09:00 - 18:00`,
        { parse_mode: 'Markdown' }
    );
});

// Send order notification to admin
export async function sendOrderNotification(order: any) {
    if (!ADMIN_CHAT_ID) {
        console.log('Admin chat ID not set, skipping notification');
        return;
    }

    const itemsList = order.items
        .map((item: any) => `  • ${item.name} x${item.quantity} - ${item.price * item.quantity} so'm`)
        .join('\n');

    const message =
        `🆕 *YANGI BUYURTMA!*\n\n` +
        `📋 Buyurtma: \`${order.id}\`\n` +
        `👤 Mijoz: ${order.customerName || 'Noma\'lum'}\n` +
        `📱 Telefon: ${order.phone}\n` +
        `📍 Manzil: ${order.address}\n` +
        `💳 To'lov: ${order.paymentMethod}\n\n` +
        `🛒 *Mahsulotlar:*\n${itemsList}\n\n` +
        `💰 *Jami: ${order.total} so'm*\n\n` +
        `${order.comment ? `💬 Izoh: ${order.comment}` : ''}`;

    try {
        await bot.api.sendMessage(ADMIN_CHAT_ID, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Tasdiqlash', callback_data: `confirm_${order.id}` },
                        { text: '❌ Bekor qilish', callback_data: `cancel_${order.id}` }
                    ]
                ]
            }
        });
    } catch (error) {
        console.error('Failed to send order notification:', error);
    }
}

// Handle callback queries
bot.on('callback_query:data', async (ctx) => {
    const data = ctx.callbackQuery.data;

    if (data.startsWith('confirm_')) {
        const orderId = data.replace('confirm_', '');
        await ctx.editMessageText(
            ctx.callbackQuery.message?.text + '\n\n✅ *TASDIQLANDI*',
            { parse_mode: 'Markdown' }
        );
        await ctx.answerCallbackQuery({ text: 'Buyurtma tasdiqlandi!' });
    } else if (data.startsWith('cancel_')) {
        const orderId = data.replace('cancel_', '');
        await ctx.editMessageText(
            ctx.callbackQuery.message?.text + '\n\n❌ *BEKOR QILINDI*',
            { parse_mode: 'Markdown' }
        );
        await ctx.answerCallbackQuery({ text: 'Buyurtma bekor qilindi!' });
    }
});

// Start bot (for standalone mode or webhook)
export async function startBot() {
    if (process.env.WEBHOOK_URL) {
        // Webhook mode for production
        const webhookUrl = `${process.env.WEBHOOK_URL}/bot${process.env.BOT_TOKEN}`;
        await bot.api.setWebhook(webhookUrl);
        console.log('🤖 Bot webhook set:', webhookUrl);
    } else {
        // Polling mode for development
        bot.start();
        console.log('🤖 Bot started in polling mode');
    }
}

export { bot };
