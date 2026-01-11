import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Formatea un número como moneda en Soles (PEN) en español de Perú.
export function formatPrice(amount, currency = 'PEN', locale = 'es-PE') {
	if (amount == null || isNaN(amount)) return '';
	return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}