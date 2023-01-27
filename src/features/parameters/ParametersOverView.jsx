import {useEffect, useState} from "react";
import img from "../../assets/app/img/default_hospital_img.jpg";
import {entrypoint} from "../../app/store";
import {useSelector} from "react-redux";
import {useGetSingleUserQuery} from "../users/userApiSlice";
import {Alert} from "react-bootstrap";
import {selectCurrentUser} from "../auth/authSlice";

export const ParametersOverView = () => {
  const user = useSelector(selectCurrentUser)
  const {hospital} = useSelector(state => state.parameters)
  const {isError} = useGetSingleUserQuery(user ? user : null)

  const [file, setFile] = useState(null)

  let content
  if (isError) content =
    <Alert variant='danger' className='text-center'>
      <p>
        Un problème est survenu lors du chargement de données. <br/>
        Veuillez actualiser la page ou vous reconnecter <i className='bi bi-exclamation-circle-fill'/>
      </p>
    </Alert>

  useEffect(() => {
    if (hospital && hospital?.logo && user && user.roles[0] !== 'ROLE_SUPER_ADMIN') {
      setFile({id: hospital.logo.id, contentUrl: hospital.logo.contentUrl})
    }
  }, [hospital, user])

  return (
    <>
      <img
        src={file ? `${entrypoint}${file.contentUrl}` : img}
        alt="Profile"
        className="rounded-circle"
        width={120}
        height={120}/>
      <h2 className='text-capitalize text-center'>
        {hospital ? hospital?.unitName ? hospital.unitName : hospital.denomination : 'Inconnue'}
      </h2>
      {content}
    </>
  )
}
