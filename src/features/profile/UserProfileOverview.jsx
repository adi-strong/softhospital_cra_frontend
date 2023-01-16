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
        label='Droit / Rôle'
        className='text-capitalize'
        body={user ? getUserRoles(user.roles) : '❓'} />
      <RowContent
        label='Mot de passe'
        className='fw-bold'
        body='*************' />

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
    </>
  )
}
