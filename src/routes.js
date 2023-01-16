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
  Galleries = lazy(() => import('./features/images/galleries'))

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
      {path: ':id', element: <SinglePatient/>},
      {path: 'covenants', element: <Covenants/>},
      {path: 'covenants/add', element: <AddCovenant/>},
      {path: 'covenants/:id', element: <SingleCovenant/>},
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
]

export default routes
