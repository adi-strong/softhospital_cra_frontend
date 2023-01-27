import {RowContent} from "../patients/PatientOverviewTab";
import {role} from "../../app/config";
import {useGetSingleUserQuery} from "../users/userApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppMainError} from "../../components";

export const UserProfileOverview = ({user}) => {
  const {data: singleUser, isSuccess, isLoading, isError} = useGetSingleUserQuery(user)

  let content
  if (isLoading) content = <BarLoaderSpinner loading={isLoading} />
  else if (isSuccess) content = singleUser &&
    <>
      <RowContent
        label='Nom'
        body={singleUser?.agent ? singleUser.agent.name : '❓'} />
      <RowContent
        label='Postnom'
        body={singleUser?.agent ? singleUser.agent?.lastName ? singleUser.agent.lastName : '❓' : '❓'} />
      <RowContent
        label='Prénom'
        body={singleUser?.agent ? singleUser.agent?.firstName ? singleUser.agent.firstName : '❓' : '❓'} />
      <RowContent
        label='Département'
        body={singleUser?.agent
          ? singleUser.agent?.service
            ? singleUser.agent.service?.department && singleUser.agent.service.department.name
            : '❓'
          : '❓'} />
      <RowContent
        label='Service'
        body={singleUser?.agent
          ? singleUser.agent?.service
            ? singleUser.agent.service.name
            : '❓'
          : '❓'} />
    </>
  else if (isError) content = <AppMainError/>

  return (
    <>
      <h5 className='card-title'>Compte</h5>
      <RowContent
        label='Username'
        className='text-lowercase'
        body={user && user.username} />
      <RowContent
        label='Nom'
        className='text-uppercase'
        body={user && user?.name ? user.name : '❓'} />
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
        body={user ? role(user.roles[0]) : '❓'} />
      <RowContent
        label='Mot de passe'
        className='fw-bold'
        body='*************' />

      {user ? user.roles[0] !== 'ROLE_OWNER_ADMIN' &&
        <>
          <h5 className='card-title'>Profil</h5>
          {content}
        </> : ''}
    </>
  )
}
