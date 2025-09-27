import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatFlow(amount: string): string {
  return `${parseFloat(amount).toFixed(4)} FLOW`
}

export function formatDate(timestamp: string): string {
  return new Date(parseInt(timestamp) * 1000).toLocaleDateString()
}

export function formatForUFix64(value: string | number): string {
  // Convert to number and format with exactly 1 decimal place for UFix64
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toFixed(1)
}
