import type { CartItem, Order, Product } from '../types.js';

const PRODUCT_CATEGORIES = new Set<Product['category']>(['bags', 'boxes', 'disposable', 'tape', 'hygiene']);
const PAYMENT_METHODS = new Set<Order['paymentMethod']>(['cash', 'click', 'payme']);
const ORDER_STATUSES = new Set<Order['status']>(['new', 'cooking', 'delivering', 'completed', 'cancelled']);

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type CreateOrderInput = {
  items: CartItem[];
  total: number;
  address: string;
  phone: string;
  customerName?: string;
  paymentMethod: Order['paymentMethod'];
  comment?: string;
  telegramId?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getTrimmedString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getFiniteNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function validateCartItem(value: unknown, index: number): ValidationResult<CartItem> {
  if (!isRecord(value)) {
    return { success: false, error: `items[${index}] must be an object` };
  }

  const id = getTrimmedString(value.id);
  const name = getTrimmedString(value.name);
  const description = getTrimmedString(value.description);
  const price = getFiniteNumber(value.price);
  const quantity = getFiniteNumber(value.quantity);
  const category = getTrimmedString(value.category) as Product['category'];
  const popular = Boolean(value.popular);
  const images = Array.isArray(value.images)
    ? value.images
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
    : [];

  if (!id) {
    return { success: false, error: `items[${index}].id is required` };
  }

  if (!name) {
    return { success: false, error: `items[${index}].name is required` };
  }

  if (price === null || price < 0) {
    return { success: false, error: `items[${index}].price must be a valid number` };
  }

  if (quantity === null || quantity <= 0) {
    return { success: false, error: `items[${index}].quantity must be greater than 0` };
  }

  if (!PRODUCT_CATEGORIES.has(category)) {
    return { success: false, error: `items[${index}].category is invalid` };
  }

  return {
    success: true,
    data: {
      id,
      name,
      description,
      price,
      quantity,
      images,
      category,
      popular,
    },
  };
}

export function validateCreateOrderInput(value: unknown): ValidationResult<CreateOrderInput> {
  if (!isRecord(value)) {
    return { success: false, error: 'Request body must be an object' };
  }

  if (!Array.isArray(value.items) || value.items.length === 0) {
    return { success: false, error: 'items must be a non-empty array' };
  }

  const items: CartItem[] = [];
  for (const [index, item] of value.items.entries()) {
    const result = validateCartItem(item, index);
    if (!result.success) {
      return result;
    }
    items.push(result.data);
  }

  const total = getFiniteNumber(value.total);
  const phone = getTrimmedString(value.phone);
  const address = getTrimmedString(value.address) || 'Belgilanmagan';
  const customerName = getTrimmedString(value.customerName);
  const paymentMethod = getTrimmedString(value.paymentMethod) as Order['paymentMethod'];
  const comment = getTrimmedString(value.comment);
  const telegramIdValue = getFiniteNumber(value.telegramId);

  if (total === null || total <= 0) {
    return { success: false, error: 'total must be greater than 0' };
  }

  if (!phone) {
    return { success: false, error: 'phone is required' };
  }

  if (!PAYMENT_METHODS.has(paymentMethod || 'cash')) {
    return { success: false, error: 'paymentMethod is invalid' };
  }

  if (customerName.length > 100) {
    return { success: false, error: 'customerName must be 100 characters or less' };
  }

  if (comment.length > 1000) {
    return { success: false, error: 'comment must be 1000 characters or less' };
  }

  if (telegramIdValue !== null && !Number.isInteger(telegramIdValue)) {
    return { success: false, error: 'telegramId must be an integer' };
  }

  return {
    success: true,
    data: {
      items,
      total,
      address,
      phone,
      customerName: customerName || undefined,
      paymentMethod: paymentMethod || 'cash',
      comment: comment || undefined,
      telegramId: telegramIdValue === null ? undefined : telegramIdValue,
    },
  };
}

export function validateCreateProductInput(value: unknown): ValidationResult<Product> {
  if (!isRecord(value)) {
    return { success: false, error: 'Request body must be an object' };
  }

  const id = getTrimmedString(value.id);
  const name = getTrimmedString(value.name);
  const description = getTrimmedString(value.description);
  const price = getFiniteNumber(value.price);
  const category = getTrimmedString(value.category) as Product['category'];
  const popular = Boolean(value.popular);
  const images = Array.isArray(value.images)
    ? value.images
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
    : [];

  if (!id) {
    return { success: false, error: 'id is required' };
  }

  if (!name) {
    return { success: false, error: 'name is required' };
  }

  if (price === null || price < 0) {
    return { success: false, error: 'price must be a valid number' };
  }

  if (!PRODUCT_CATEGORIES.has(category)) {
    return { success: false, error: 'category is invalid' };
  }

  return {
    success: true,
    data: {
      id,
      name,
      description,
      price,
      images,
      category,
      popular,
    },
  };
}

export function validateOrderStatusInput(value: unknown): ValidationResult<Order['status']> {
  const status = getTrimmedString(value);
  if (!ORDER_STATUSES.has(status as Order['status'])) {
    return { success: false, error: 'status is invalid' };
  }

  return {
    success: true,
    data: status as Order['status'],
  };
}
