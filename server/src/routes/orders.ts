import { Router } from 'express';
import { createOrder, getOrdersByPhone, getAllOrders, updateOrderStatus } from '../db/neon.js';
import { sendOrderNotification } from '../bot/index.js';
import { requestHasValidAdminToken, requireAdmin } from '../lib/adminAuth.js';
import { validateCreateOrderInput, validateOrderStatusInput } from '../lib/validation.js';

const router = Router();

// POST /api/orders - Yangi buyurtma
router.post('/', async (req, res) => {
    try {
        const validation = validateCreateOrderInput(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error });
        }

        const { items, total, address, phone, customerName, paymentMethod, comment, telegramId } = validation.data;

        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const order = await createOrder({
            id: orderId,
            items,
            total,
            address: address || 'Belgilanmagan',
            phone,
            customerName,
            paymentMethod: paymentMethod || 'cash',
            comment,
            telegramId
        });

        // Telegram ga xabar yuborish
        try {
            await sendOrderNotification(order);
        } catch (e) {
            console.error('Failed to send Telegram notification:', e);
        }

        res.status(201).json({ success: true, orderId, order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET /api/orders?phone=xxx - Foydalanuvchi buyurtmalari
router.get('/', async (req, res) => {
    try {
        const { phone, all } = req.query;

        if (all === 'true') {
            // Admin uchun barcha buyurtmalar
            if (!requestHasValidAdminToken(req)) {
                return res.status(401).json({ error: 'Admin authorization required' });
            }
            const orders = await getAllOrders();
            return res.json(orders);
        }

        if (!phone) {
            return res.status(400).json({ error: 'Phone required' });
        }

        const orders = await getOrdersByPhone(phone as string);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PATCH /api/orders/:id - Status yangilash
router.patch('/:id', requireAdmin, async (req, res) => {
    try {
        const validation = validateOrderStatusInput(req.body?.status);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error });
        }

        await updateOrderStatus(req.params.id, validation.data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
});

export default router;
