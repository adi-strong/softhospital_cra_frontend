import img from '../../assets/app/img/default_hospital_img.jpg';
import {getUserRoles} from "../../services/handleUserRolesService";
import {useEffect, useState} from "react";
import {entrypoint} from "../../app/store";
import {useGetSingleUserQuery} from "../users/userApiSlice";
import {Alert} from "react-bootstrap";

export const UserProfile = ({user}) => {
  const {data: singleUser, isSuccess, isLoading, isError, isFetching} = useGetSingleUserQuery(user)
  const [file, setFile] = useState(null)

  let content
  if (isLoading || isFetching) content = <>Chargement en cours...</>
  else if (isError) content =
    <Alert variant='danger' className='text-center'>
      <p>
        Une erreur s'est produite. <br/>
        Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/>
      </p>
    </Alert>

  useEffect(() => {
    if (isSuccess && singleUser && singleUser?.profile) {
      setFile(`${entrypoint}${singleUser.profile.contentUrl}`)
    }
  }, [isSuccess, singleUser])

  return (
    <>
      <img
        src={file ? file : img} alt="Profile"
        className="rounded-circle"
        width={120}
        height={120}/>
      {content}
      <h2 className='text-capitalize'>{user && user.username}</h2>
      <h3 className='text-capitalize'>{user && getUserRoles(user.roles)}</h3>
    </>
  )
}
