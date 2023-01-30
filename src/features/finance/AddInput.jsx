import {AppLgModal} from "../../components";
import {useState} from "react";
import {useSelector} from "react-redux";
import {useAddNewInputMutation} from "./inputApiSlice";
import {AddInputForm} from "./AddInputForm";
import {limitStrTo} from "../../services";
import {Button} from "react-bootstrap";
import toast from "react-hot-toast";

const Item = ({output, onClick, currency}) => {
  return (
    <>
      <tr>
        <td className='fw-bold'>#{output.docRef}</td>
        <td className='text-uppercase'>{output.porter}</td>
        <td className='text-capitalize'>{limitStrTo(18, output.reason)}</td>
        <td className='fw-bolder'>
          <span className='me-1 text-secondary'>{currency && currency.value}</span>
          {output.amount}
        </td>
        <td className='text-end'>
          <Button type='button' variant='light' onClick={onClick}>
            <i className='bi bi-dash'/>
          </Button>
        </td>
      </tr>
    </>
  )
}

export const AddInput = ({show, onHide, boxId}) => {
  const [inputs, setInputs] = useState([])
  const [addNewInput, {isLoading}] = useAddNewInputMutation()
  const { fCurrency } = useSelector(state => state.parameters)

  const onReset = () => setInputs([])

  const onRemove = index => {
    const values = [...inputs]
    values.splice(index, 1)
    setInputs(values)
  }

  async function onSubmit() {
    if (inputs.length > 0) {
      let values = [...inputs]
      for (const key in inputs) {
        const formData = await addNewInput({...inputs[key], box: boxId})
        if (!formData.error) {
          values = values.filter(item => item !== inputs[key])
          setInputs(values)
          toast.success('Opération bien efféctuée.')
          if (values.length < 1) onHide()
        }
        else {
          const violations = formData.error.data.violations
          if (violations) {
            violations.forEach(({propertyPath, message}) => {
              toast.error(`${propertyPath}: ${message}`, {
                style: {
                  background: 'red',
                  color: '#fff',
                }
              })
            })
          }
        }
      }
    }
    else alert('Aucune information renseignée !')
  }

  return (
    <>
      <AppLgModal
        className='bg-light'
        onClick={onSubmit}
        loader={isLoading}
        title='Enregistrer une entrée'
        onHide={onHide}
        show={show}>
        <AddInputForm loader={isLoading} setInputs={setInputs} inputs={inputs} currency={fCurrency}/>
        <div className='dashboard'>
          <div className='top-selling'>
            <table className='table'>
              <thead>
              <tr>
                <th>#</th>
                <th>Porteur</th>
                <th>Motif</th>
                <th>Montant</th>
                <th className='text-end' style={{ cursor: 'pointer' }} onClick={onReset}>
                  <i className='bi bi-arrow-clockwise text-primary'/>
                </th>
              </tr>
              </thead>
              <tbody>
              {inputs && inputs.map((input, key) =>
                <Item key={key} output={input} currency={fCurrency} onClick={() => onRemove(key)}/>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppLgModal>
    </>
  )
}
