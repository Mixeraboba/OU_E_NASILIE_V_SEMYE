const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim())
}

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false
  const hasDigit = /\d/.test(password)
  const hasLetter = /[a-zA-Z]/.test(password)
  return password.length >= 8 && hasDigit && hasLetter
}

export const validateName = (name) => {
  return name && typeof name === 'string' && name.trim().length > 0
}

export const validatePrice = (price) => {
  const n = Number(price)
  return !Number.isNaN(n) && n >= 0
}

export const validateItemsForOrder = (items) => {
  if (!Array.isArray(items) || items.length === 0) return false
  for (const item of items) {
    if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return false
    }
  }
  return true
}