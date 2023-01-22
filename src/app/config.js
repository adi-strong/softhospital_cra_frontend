export const ROLE_USER = 'ROLE_USER'
const ROLE_RECEPTIONIST = 'ROLE_RECEPTIONIST' || ROLE_USER
export const ROLE_DRUGGIST = 'ROLE_DRUGGIST' || ROLE_RECEPTIONIST
export const ROLE_CASHIER = 'ROLE_CASHIER' || ROLE_RECEPTIONIST
export const ROLE_MEDIC = 'ROLE_MEDIC' || ROLE_RECEPTIONIST
export const ROLE_DOCTOR = 'ROLE_DOCTOR' || ROLE_MEDIC
export const ROLE_ADMIN = 'ROLE_ADMIN' || ROLE_DOCTOR
export const ROLE_OWNER_ADMIN = 'ROLE_OWNER_ADMIN' || ROLE_ADMIN
export const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN' || ROLE_OWNER_ADMIN

export const countries = require('../app/jsonData/countries.json')
export const currencies = countries.map(currency => {
  const symbol = currency.currency?.symbol ? currency.currency.symbol : currency.currency.code
  return {
    label: `(${currency.code}) ${currency.name} ' ${symbol} '`,
    value: symbol,
    flag: currency?.flag ? currency.flag : null,
    code: currency.code,
    currency: currency.currency.code,
    name: `${currency.name} (${currency.currency.code})`,
  }
})

export const role = (str: string = null) => {
  switch (str) {
    case 'ROLE_SUPER_ADMIN':
      return 'ROLE_SUPER_ADMIN'
    case 'ROLE_OWNER_ADMIN':
      return 'ROLE_OWNER_ADMIN'
    case 'ROLE_ADMIN':
      return 'ROLE_ADMIN'
    case 'ROLE_DOCTOR':
      return 'ROLE_DOCTOR'
    case 'ROLE_MEDIC':
      return 'ROLE_MEDIC'
    case 'ROLE_CASHIER':
      return 'ROLE_CASHIER'
    case 'ROLE_DRUGGIST':
      return 'ROLE_DRUGGIST'
    default:
      return ROLE_USER
  }
}
