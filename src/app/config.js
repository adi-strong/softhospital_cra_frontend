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
      return 'Super Admin'
    case 'ROLE_OWNER_ADMIN':
      return 'Super Admin'
    case 'ROLE_ADMIN':
      return 'Administrateur'
    case 'ROLE_DOCTOR':
      return 'Docteur'
    case 'ROLE_MEDIC':
      return 'Médecin'
    case 'ROLE_CASHIER':
      return 'Caissier'
    case 'ROLE_DRUGGIST':
      return 'Pharmacien(ne)'
    case 'ROLE_LAB':
      return 'Laborantin'
    case 'ROLE_RECEPTIONIST':
      return 'Réceptioniste'
    default:
      return 'Simple utilisateur'
  }
}
