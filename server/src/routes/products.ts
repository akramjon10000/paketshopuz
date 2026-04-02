import { Router } from 'express';
import { getProducts, getProductById, createProduct, deleteProduct } from '../db/neon.js';
import { requireAdmin } from '../lib/adminAuth.js';
import { validateCreateProductInput } from '../lib/validation.js';

const router = Router();

// GET /api/products - Barcha mahsulotlar
router.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/:id - Bitta mahsulot
router.get('/:id', async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /api/products - Yangi mahsulot (Admin uchun)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const validation = validateCreateProductInput(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error });
        }

        const { id, name, description, price, images, category, popular } = validation.data;
        await createProduct({ id, name, description, price, images, category, popular });
        res.status(201).json({ success: true, id });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
