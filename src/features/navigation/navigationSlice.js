import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  dropdownSideMenuItems: [
    {
      id: 1,
      label: 'Patients',
      icon: 'bi bi-people',
      path: '#patients',
      isOpened: false,
      items: [
        {id: 1, label: 'Liste', path: '/member/patients'},
        {id: 1, label: 'Conventions (Organismes)', path: '/member/patients/covenants'},
      ]
    },
    {
      id: 2,
      label: 'Tâches',
      icon: 'bi bi-list-nested',
      path: '#tasks',
      isOpened: false,
      items: [
        {id: 2, label: 'Types de fiches médicales', path: '/member/tasks/files'},
        {id: 2, label: 'Actes médicaux', path: '/member/tasks/acts'},
        {id: 2, label: 'Examens', path: '/member/tasks/exams'},
        {id: 2, label: 'Traitements', path: '/member/tasks/treatments'},
        {id: 2, label: "Lits d'hospitalisation", path: '/member/tasks/beds'},
      ]
    },
    {
      id: 3,
      label: 'Traitements',
      icon: 'bi bi-h-circle',
      path: '#treatments',
      isOpened: false,
      items: [
        {id: 3, label: 'Consultations', path: '/member/treatments/consultations'},
        {id: 3, label: 'Médecin (Rendez-vous)', path: '/member/treatments/appointments'},
        {id: 3, label: 'Laboratoire', path: '/member/treatments/lab'},
        {id: 3, label: 'Prescription du médecin', path: '/member/treatments/prescription'},
        {id: 3, label: 'Nursing', path: '/member/treatments/nursing'},
      ]
    },
    {
      id: 4,
      label: 'Pharmacie',
      icon: 'bi bi-capsule',
      path: '#drugstore',
      isOpened: false,
      items: [
        {id: 4, label: 'Categories', path: '/member/drugstore/categories'},
        {id: 4, label: 'Produits', path: '/member/drugstore/medicines'},
        {id: 4, label: 'Unités de consommation', path: '/member/drugstore/consuptions-units'},
        {id: 4, label: 'Fournisseurs', path: '/member/drugstore/providers'},
        {id: 4, label: 'Approvisionnement', path: '/member/drugstore/supply'},
        {id: 4, label: 'Ventes', path: '/member/drugstore/sales'},
        {id: 4, label: 'Factures', path: '/member/drugstore/invoices'},
      ]
    },
    {
      id: 5,
      label: 'Finances',
      icon: 'bi bi-currency-exchange',
      path: '#finances',
      isOpened: false,
      items: [
        {id: 5, label: 'Factures', path: '/member/finance/invoices'},
        {id: 5, label: 'Dépenses', path: '/member/finance/expenses'},
        {id: 5, label: 'Entrées', path: '/member/finance/entries'},
        {id: 5, label: 'Sorties', path: '/member/finance/outputs'},
      ]
    },
    {
      id: 6,
      label: 'Personnel',
      icon: 'bi bi-person',
      path: '#staff',
      isOpened: false,
      items: [
        {id: 6, label: 'Départements', path: '/member/staff/departments'},
        {id: 6, label: 'Services', path: '/member/staff/services'},
        {id: 6, label: 'Fonctions (Titres)', path: '/member/staff/offices'},
        {id: 6, label: 'Agents', path: '/member/staff/agents'},
        {id: 6, label: 'Utilisateurs', path: '/member/staff/users'},
      ]
    },
    {
      id: 7,
      label: 'Images',
      icon: 'bi bi-images',
      path: '#pictures',
      isOpened: false,
      items: [
        {id: 7, label: 'Galeries', path: '/member/pictures/galleries'},
      ]
    },
  ]
}

const navigationSlice = createSlice({
  name: 'navs',
  initialState,
  reducers: {
    onToggleSidebarMenu: (state, action) => {
      state.dropdownSideMenuItems = state.dropdownSideMenuItems.map(menu => {
        if (menu.id === action.payload) {
          menu.isOpened = !menu.isOpened
        } else menu.isOpened = false
        return menu
      })
    },

    onResetSideMenuItem: state => {
      state.dropdownSideMenuItems = state.dropdownSideMenuItems.map(menu => {
        menu.isOpened = false
        return menu
      })
    },

    onInitSidebarMenu: (state, action) => {
      state.dropdownSideMenuItems = state.dropdownSideMenuItems.map(menu => {
        let id
        for (const key in menu.items) {
          if (menu.items[key].path === action.payload)
            id = menu.items[key].id
        }

        for (const key in menu.items) {
          menu.isOpened = menu.items[key].id === id;
        }
        return menu
      })
    },
  }
})

export const {
  onToggleSidebarMenu,
  onResetSideMenuItem,
  onInitSidebarMenu,
} = navigationSlice.actions

export default navigationSlice
