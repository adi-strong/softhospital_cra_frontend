import {AppLgModal} from "../../components";
import {useState} from "react";
import {AppointmentForm} from "./AppointmentForm";
import {useAddNewAppointmentMutation} from "./appointmentApiSlice";
import toast from "react-hot-toast";

export const AddAppointment = ({ show, onHide }) => {
  const [appointment, setAppointment] = useState({
    doctor: null,
    patient: null,
    reason: '',
    description: '',
    appointmentDate: new Date(),
  })
  const [addNewAppointment, {isLoading, isError, error}] = useAddNewAppointmentMutation()

  const onReset = () => setAppointment({
    description: '',
    doctor: null,
    reason: '',
    patient: null,
    appointmentDate: new Date()
  })

  let apiErrors = {doctor: null, patient: null}

  const canSave = [appointment.patient, appointment.doctor].every(Boolean) || !isLoading

  async function onSubmit(e) {
    e.preventDefault()
    if (canSave) {
      const formData = await addNewAppointment(appointment)
      if (!formData?.error) {
        toast.success('Opération bien efféctuée.')
        onHide()
      }
    }
    else alert('Veuillez renseigner les (⭐) champs obligatoires ❗')
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppLgModal
        loader={isLoading}
        title={<><i className='bi bi-plus'/> Fixer un rendez-vous <i className='bi bi-pin-angle-fill text-danger'/></>}
        className='bg-light'
        onClick={onSubmit}
        show={show}
        onHide={onHide}>
        <AppointmentForm
          state={appointment}
          setState={setAppointment}
          loader={isLoading}
          apiErrors={apiErrors}
          onReset={onReset} />
      </AppLgModal>
    </>
  )
}
