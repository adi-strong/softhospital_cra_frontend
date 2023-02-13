import {lazy} from "react";

const
  Dashboard = lazy(() => import('./features/dashboard/dashboard')),
  Reception = lazy(() => import('./features/reception/reception')),
  Patients = lazy(() => import('./features/patients/patients')),
  Covenants = lazy(() => import('./features/covenants/covenants')),
  SingleCovenant = lazy(() => import('./features/covenants/singleCovenant')),
  AddCovenant = lazy(() => import('./features/covenants/addCovenant')),
  Acts = lazy(() => import('./features/acts/acts')),
  Orders = lazy(() => import('./features/orders/orders')),
  SinglePatient = lazy(() => import('./features/patients/singlePatient')),
  AddPatient = lazy(() => import('./features/patients/addPatient')),
  Exams = lazy(() => import('./features/exams/exams')),
  Treatments = lazy(() => import('./features/treatments/treatments')),
  Beds = lazy(() => import('./features/beds/beds')),
  Files = lazy(() => import('./features/files/files')),
  Consultations = lazy(() => import('./features/consultations/consultations')),
  AddConsultation = lazy(() => import('./features/consultations/addConsultation')),
  Appointments = lazy(() => import('./features/appointments/appointments')),
  Lab = lazy(() => import('./features/lab/lab')),
  Galleries = lazy(() => import('./features/images/galleries')),
  Offices = lazy(() => import('./features/staff/offices')),
  Users = lazy(() => import('./features/users/users')),
  Departments = lazy(() => import('./features/staff/departments')),
  Services = lazy(() => import('./features/staff/services')),
  Staff = lazy(() => import('./features/staff/staff')),
  AddAgent = lazy(() => import('./features/staff/addAgent')),
  EditAgent = lazy(() => import('./features/staff/editAgent')),
  Invoices = lazy(() => import('./features/finance/invoices')),
  Expenses = lazy(() => import('./features/finance/expenses')),
  Entries = lazy(() => import('./features/finance/entries')),
  Outputs = lazy(() => import('./features/finance/outputs')),
  MedicineCategories = lazy(() => import('./features/medicines/medicineCategories')),
  DrugStore = lazy(() => import('./features/medicines/drugStore')),
  Providers = lazy(() => import('./features/medicines/providers')),
  MedicinesInvoicing = lazy(() => import('./features/medicines/medicinesInvoicing'))

const routes = [
  {
    path: '/member/',
    outlets: [
      {path: 'dashboard', element: <Dashboard/>},
      {path: 'orders', element: <Orders/>},
      {path: 'reception', element: <Reception/>},
    ]
  },

  {
    path: '/member/patients/',
    outlets: [
      {index: true, element: <Patients/>},
      {path: 'add', element: <AddPatient/>},
      {path: ':id/:slug', element: <SinglePatient/>},
      {path: 'covenants', element: <Covenants/>},
      {path: 'covenants/add', element: <AddCovenant/>},
      {path: 'covenants/:id/:slug', element: <SingleCovenant/>},
    ]
  },

  // TASKS *****************************************************************************
  {
    path: '/member/tasks/',
    outlets: [
      {path: 'acts', element: <Acts/>},
      {path: 'exams', element: <Exams/>},
      {path: 'treatments', element: <Treatments/>},
      {path: 'beds', element: <Beds/>},
      {path: 'files', element: <Files/>},
    ]
  },
  // End TASKS *************************************************************************

  // TREATMENTS *****************************************************************************
  {
    path: '/member/treatments/',
    outlets: [
      {path: 'consultations', element: <Consultations/>},
      {path: 'consultations/add', element: <AddConsultation/>},
      {path: 'appointments', element: <Appointments/>},
      {path: 'lab', element: <Lab/>},
    ]
  },
  // End TREATMENTS *************************************************************************

  // PICTURES *****************************************************************************
  {
    path: '/member/pictures/',
    outlets: [
      {path: 'galleries', element: <Galleries/>},
    ]
  },
  // End PICTURES *************************************************************************

  // STAFF *****************************************************************************
  {
    path: '/member/staff/',
    outlets: [
      {path: 'agents', element: <Staff/>},
      {path: 'agents/add', element: <AddAgent/>},
      {path: 'agents/edit/:agentId/:slug', element: <EditAgent/>},
      {path: 'departments', element: <Departments/>},
      {path: 'services', element: <Services/>},
      {path: 'offices', element: <Offices/>},
      {path: 'users', element: <Users/>},
    ]
  },
  // End STAFF *************************************************************************

  // STAFF *****************************************************************************
  {
    path: '/member/finance/',
    outlets: [
      {path: 'invoices', element: <Invoices/>},
      {path: 'expenses', element: <Expenses/>},
      {path: 'entries', element: <Entries/>},
      {path: 'outputs', element: <Outputs/>},
    ]
  },
  // End STAFF *************************************************************************

  // MEDICINES *****************************************************************************
  {
    path: '/member/drugstore/',
    outlets: [
      {path: 'medicines', element: <DrugStore/>},
      {path: 'categories', element: <MedicineCategories/>},
      {path: 'providers', element: <Providers/>},
      {path: 'sales', element: <MedicinesInvoicing/>},
    ]
  },
  // End MEDICINES *************************************************************************
]

export default routes
