import img from '../../assets/app/img/default_profile.jpg';
import {getUserRoles} from "../../services/handleUserRolesService";

export const UserProfile = ({user}) => {
  return (
    <>
      <img src={img} alt="Profile" className="rounded-circle" width={120} height={120}/>
      <h2 className='text-capitalize'>{user && user.username}</h2>
      <h3 className='text-capitalize'>{user && getUserRoles(user.roles)}</h3>
    </>
  )
}
