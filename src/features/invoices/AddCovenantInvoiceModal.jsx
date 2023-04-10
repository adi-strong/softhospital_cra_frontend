import {Button, Modal, Spinner} from "react-bootstrap";
import {AppDataTableStripped} from "../../components";
import {useAddNewCovenantInvoiceMutation} from "./covenantInvoiceApiSlice";
import toast from "react-hot-toast";

export const AddCovenantInvoiceModal = ({ id, onRefresh, setKey, data, onHide, show = false }) => {
  const [addNewCovenantInvoice, {isLoading, isError}] = useAddNewCovenantInvoiceMutation()

  async function onSubmit() {
    const req = await addNewCovenantInvoice({...data, covenant: `/api/covenants/${id}`})
    if (!req?.error) {
      toast.success('Opération bien efféctuée.')
      setKey('list')
      onHide()
      onRefresh()
    }
  }

  if (isError) alert('Erreur; Erreur survenue lors de l\'envoi de données. Veuillez réessayer ❗')

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header className='bg-primary text-light'>
          <Modal.Title><i className='bi bi-plus'/> Création de la facture</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className='text-center'>
            <small>
              <code><i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.</code>
            </small>
          </p>

          <h6 className='mb-0 bi bi-journal-medical'> Services médicals</h6> <hr className='mt-0 mb-0'/>
          <AppDataTableStripped
            tbody={
              <tbody>
                <tr>
                  <th>Fiches médicales</th>
                  <td className='text-end' style={{ fontWeight: 800 }}>
                    {data?.filesPrice && data.filesPrice > 0 &&
                      <>
                        {parseFloat(data.filesPrice).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
                <tr>
                  <th>Actes médicaux</th>
                  <td className='text-end' style={{ fontWeight: 800 }}>
                    {data?.totalActsBaskets && data.totalActsBaskets > 0 &&
                      <>
                        {parseFloat(data.totalActsBaskets).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
                <tr>
                  <th>Examens</th>
                  <td className='text-end' style={{ fontWeight: 800 }}>
                    {data?.totalExamsBaskets && data.totalExamsBaskets > 0 &&
                      <>
                        {parseFloat(data.totalExamsBaskets).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
                <tr>
                  <th>Traitements</th>
                  <td className='text-end' style={{ fontWeight: 800 }}>
                    {data?.totalNursingPrice && data.totalNursingPrice > 0 &&
                      <>
                        {parseFloat(data.totalNursingPrice).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
                <tr>
                  <th>Hospitalisations</th>
                  <td className='text-end' style={{ fontWeight: 800 }}>
                    {data?.hospPrice && data.hospPrice > 0 &&
                      <>
                        {parseFloat(data.hospPrice).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
                <tr className='bg-primary text-light'>
                  <th>Sous total HT</th>
                  <td className='text-end text-decoration-underline' style={{ fontWeight: 900 }}>
                    {data?.subTotal && data.subTotal > 0 &&
                      <>
                        {parseFloat(data.subTotal).toFixed(2).toLocaleString()+' '}
                        {data?.currency && data.currency}
                      </>}
                  </td>
                </tr>
              </tbody>}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide} disabled={isLoading}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' variant='primary' disabled={isLoading} onClick={onSubmit}>
            <i className='bi bi-plus me-1'/>
            {!isLoading ? 'Créer' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
