import {Card} from "react-bootstrap";
import {PatientsList} from "./PatientsList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowPatientsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

function Patients() {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowPatientsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <div className='dashboard section'>
        <Card className='border-0 top-selling overflow-auto'>
          <Card.Body>
            <PatientsList/>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Patients
