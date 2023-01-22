import {RowContent} from "../patients/PatientOverviewTab";
import {getUserRoles} from "../../services/handleUserRolesService";

export const UserProfileOverview = ({user}) => {
  return (
    <>
      <h5 className='card-title'>Compte</h5>
      <RowContent
        label='Username'
        className='text-lowercase'
        body={user && user.username} />
      <RowContent
        label='n° Téléphone'
        className='text-lowercase'
        body={user ? user.tel : '❓'} />
      <RowContent
        label='Email'
        className='text-lowercase text-primary'
        body={user && user?.email ? user.email : '❓'} />
      <RowContent
        label='Droit / Rôle'
        className='text-uppercase'
        body={user ? getUserRoles(user.roles) : '❓'} />
      <RowContent
        label='Mot de passe'
        className='fw-bold'
        body='*************' />

      {user ? user.roles[0] !== 'ROLE_OWNER_ADMIN' &&
        <>
          <h5 className='card-title'>Profil</h5>
          <RowContent
            label='Nom'
            body={'❓'} />
          <RowContent
            label='Postnom'
            body={'❓'} />
          <RowContent
            label='Prénom'
            body={'❓'} />
          <RowContent
            label='Département'
            body={'❓'} />
          <RowContent
            label='Service'
            body={'❓'} />
        </> : ''}
    </>
  )
}
