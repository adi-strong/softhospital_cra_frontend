export const ROLE_USER = 'ROLE_USER'
export const ROLE_PHAR = 'ROLE_PHAR' || ROLE_USER
export const ROLE_RECEIVER = 'ROLE_RECEIVER' || ROLE_USER
export const ROLE_LAB = 'ROLE_LAB' || ROLE_RECEIVER
export const ROLE_MANAGER = 'ROLE_MANAGER' || ROLE_RECEIVER || ROLE_PHAR
export const ROLE_LOCKER = 'ROLE_LOCKER' || ROLE_MANAGER
export const ROLE_NURSE = 'ROLE_NURSE' || ROLE_RECEIVER
export const ROLE_DOCTOR = 'ROLE_DOCTOR' || ROLE_NURSE
export const ROLE_ADMIN = 'ROLE_ADMIN' || ROLE_DOCTOR || ROLE_LAB || ROLE_PHAR
export const ROLE_MD = 'ROLE_MD' || ROLE_ADMIN || ROLE_LOCKER
export const ROLE_OWNER_ADMIN = 'ROLE_OWNER_ADMIN' || ROLE_MD
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
    case 'ROLE_PHAR':
      return 'Pharmacien(ne)'
    case 'ROLE_MANAGER':
      return 'Gestionnaire'
    case 'ROLE_OWNER_ADMIN':
      return 'Super Admin'
    case 'ROLE_MD':
      return 'Médecin directeur'
    case 'ROLE_ADMIN':
      return 'Administrateur'
    case 'ROLE_DOCTOR':
      return 'Médecin / Docteur'
    case 'ROLE_NURSE':
      return 'Infirmier(e)'
    case 'ROLE_LOCKER':
      return 'Caissier'
    case 'ROLE_LAB':
      return 'Laborantin(e)'
    case 'ROLE_RECEIVER':
      return 'Réceptioniste'
    default:
      return 'Utilisateur'
  }
}

//  ALLOW SHOW PAGES **********************************************************************************
/* ************************************************************************************************** */
export const allowShowOrdersPage = (role) => {
  switch (role) {
    case ROLE_RECEIVER:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_NURSE:
      return true
    case ROLE_DOCTOR:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowDashPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowFilesPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowActsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowExamsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowTreatmentsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowBedsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowPatientsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_LAB:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_PHAR:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_RECEIVER:
      return true
    case ROLE_DOCTOR:
      return true
    case ROLE_NURSE:
      return true
    default:
      return false
  }
}

export const allowShowSingleCovenantPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_LOCKER:
      return true
    default:
      return false
  }
}

export const allowShowCovenantsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_RECEIVER:
      return true
    case ROLE_NURSE:
      return true
    case ROLE_DOCTOR:
      return true
    case ROLE_LAB:
      return true
    default:
      return false
  }
}

export const allowShowConsultationsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_DOCTOR:
      return true
    default:
      return false
  }
}

export const allowShowSingleConsultationsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_PHAR:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_RECEIVER:
      return true
    case ROLE_DOCTOR:
      return true
    case ROLE_NURSE:
      return true
    case ROLE_LAB:
      return true
    default:
      return false
  }
}

export const allowShowAppointmentsPage = (role) => {
  switch (role) {
    case ROLE_DOCTOR:
      return true
    default:
      return false
  }
}

export const allowShowSingleAppointmentsPage = (role) => {
  switch (role) {
    case ROLE_DOCTOR:
      return true
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowLabPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_LAB:
      return true
    default:
      return false
  }
}

export const allowShowSingleLabPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_LAB:
      return true
    default:
      return false
  }
}

export const allowShowPrescriptionsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_DOCTOR:
      return true
    default:
      return false
  }
}

export const allowShowNursingPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_NURSE:
      return true
    default:
      return false
  }
}

export const allowShowDrugsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_PHAR:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    default:
      return false
  }
}

export const allowShowFinancesPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_LOCKER:
      return true
    default:
      return false
  }
}

export const allowShowGalleryPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_LAB:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_PHAR:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_RECEIVER:
      return true
    case ROLE_DOCTOR:
      return true
    case ROLE_NURSE:
      return true
    default:
      return false
  }
}

export const allowShowPersonalsPage = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowParametersPage = (role) => allowShowDashPage(role)
/* ************************************************************************************************** */
//  END ALLOW SHOW PAGES ******************************************************************************



//  ALLOW OPERATIONS ***********************************************************************************
/* ************************************************************************************************** */
export const allowActionsToPatients = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_RECEIVER:
      return true
    case ROLE_LAB:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    case ROLE_NURSE:
      return true
    case ROLE_DOCTOR:
      return true
    default:
      return false
  }
}
/* ************************************************************************************************** */
//  END ALLOW OPERATIONS *******************************************************************************

//  ALLOW SHOW SIDE MENUS ******************************************************************************
/* ************************************************************************************************** */
export const allowShowTasksMenus = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    default:
      return false
  }
}

export const allowShowPatientsMenus = (role) => allowShowPatientsPage(role)

export const allowShowTreatmentsMenus = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_LAB:
      return true
    case ROLE_NURSE:
      return true
    case ROLE_DOCTOR:
      return true
    default:
      return false
  }
}

export const allowShowDrugstoreMenus = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_ADMIN:
      return true
    case ROLE_PHAR:
      return true
    case ROLE_MANAGER:
      return true
    case ROLE_LOCKER:
      return true
    default:
      return false
  }
}

export const allowShowFinancesMenus = (role) => {
  switch (role) {
    case ROLE_MD:
      return true
    case ROLE_OWNER_ADMIN:
      return true
    case ROLE_SUPER_ADMIN:
      return true
    case ROLE_LOCKER:
      return true
    default:
      return false
  }
}

export const allowShowGalleryMenus = (role) => allowShowGalleryPage(role)

export const allowShowPersonalMenus = (role) => allowShowTasksMenus(role)
/* ************************************************************************************************** */
//  END ALLOW SHOW SIDE MENUS **************************************************************************
