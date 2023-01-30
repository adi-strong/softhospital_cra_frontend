import {useState} from "react";
import {AppLgModal} from "../../components";
import {useSelector} from "react-redux";
import {useAddNewOutputMutation} from "./outputApiSlice";
import {limitStrTo} from "../../services";
import {Button} from "react-bootstrap";
import {AddOutputForm} from "./AddOutputForm";
import toast from "react-hot-toast";

const Item = ({output, onClick, currency}) => {
  return (
    <>
      <tr>
        <td className='fw-bold'>#{output.docRef}</td>
        <td className='text-uppercase'>{output.recipient}</td>
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

export const AddOutput = ({show, onHide, boxId}) => {
  const [outputs, setOutputs] = useState([])
  const [addNewOutput, {isLoading}] = useAddNewOutputMutation()
  const { fCurrency } = useSelector(state => state.parameters)

  const onReset = () => setOutputs([])

  const onRemove = index => {
    const values = [...outputs]
    values.splice(index, 1)
    setOutputs(values)
  }

  async function onSubmit() {
    if (outputs.length > 0) {
      let values = [...outputs]
      for (const key in outputs) {
        try {
          const formData = await addNewOutput({...outputs[key], box: boxId})
          if (!formData.error) {
            values = values.filter(item => item !== outputs[key])
            setOutputs(values)
            toast.success('Dépense bien efféctuée.')
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
        catch (e) { }
      }
    }
  }

  return (
    <>
      <AppLgModal
        loader={isLoading}
        title='Enregistrer une nouvelle dépense'
        onClick={onSubmit}
        onHide={onHide}
        show={show}
        className='bg-light'>
        <AddOutputForm loader={isLoading} currency={fCurrency} outputs={outputs} setOutputs={setOutputs} />
        <div className='dashboard'>
          <div className='top-selling'>
            <table className='table'>
              <thead>
              <tr>
                <th>#</th>
                <th>Bénéficiaire</th>
                <th>Motif</th>
                <th>Montant</th>
                <th className='text-end' style={{ cursor: 'pointer' }} onClick={onReset}>
                  <i className='bi bi-arrow-clockwise text-primary'/>
                </th>
              </tr>
              </thead>
              <tbody>
              {outputs && outputs.map((input, key) =>
                <Item key={key} output={input} currency={fCurrency} onClick={() => onRemove(key)}/>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppLgModal>
    </>
  )
}
