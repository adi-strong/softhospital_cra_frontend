import {memo} from "react";
import {Button, Col, FloatingLabel, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {roundANumber} from "../invoices/singleInvoice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import toast from "react-hot-toast";
import {useUpdateNursingMutation} from "./nursingApiSlice";

const NursingInvoiceForm = (
  {
    sum,
    setSum,
    onReset,
    discount,
    setDiscount,
    onTaxChange,
    currency,
    nursing,
    tax,
    setTax,
    totalAmount,
    setNetPayable,
    refetch
  }) => {
  const [updateNursing, {isLoading: loader}] = useUpdateNursingMutation()

  const handleAmountChange = ({ target }) => {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    setSum(value)
  }

  const onVTAClick = () => {
    if (nursing) {
      const value = !tax?.isTChecked
      const vTA = (totalAmount * tax?.vTA) / 100
      const total = totalAmount + vTA
      setTax({...tax, isTChecked: value, aTI: value ? total : roundANumber(totalAmount, 2)})
      if (discount.isDChecked && value) {
        const disc = (totalAmount * discount.discount) / 100
        const res = totalAmount - disc
        setNetPayable(roundANumber(total + res, 2))
      }
      else if (discount.isDChecked) {
        const disc = (totalAmount * discount.discount) / 100
        const res = totalAmount - disc
        setNetPayable(roundANumber(res, 2))
      }
      else if (value) setNetPayable(roundANumber(total, 2))
      else setNetPayable(roundANumber(totalAmount, 2))
    }
  }

  const onDiscountClick = () => {
    if (nursing) {
      const value = !discount?.isDChecked
      const disc = (totalAmount * discount.discount) / 100
      const total = totalAmount - disc
      setDiscount({...discount, isDChecked: value})
      if (tax.isTChecked && value) setNetPayable(roundANumber(tax?.aTI + total, 2))
      else if (value) setNetPayable(roundANumber(total, 2))
      else if (tax.isTChecked) setNetPayable(roundANumber(tax?.aTI, 2))
      else setNetPayable(roundANumber(totalAmount, 2))
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (nursing && sum > 0.00) {
      if (!nursing?.isCompleted) {
        if (discount.isDChecked && tax.isTChecked) {
          const formData1 = await updateNursing({
            id: nursing?.id,
            amount: totalAmount.toString(),
            sum: sum.toString(),
            vTA: parseFloat(tax?.vTA),
            discount: parseFloat(discount?.discount),
          })
          if (!formData1.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        }
        else if (discount.isDChecked) {
          const formData2 = await updateNursing({
            id: nursing?.id,
            amount: totalAmount.toString(),
            sum: sum.toString(),
            discount: parseFloat(discount?.discount),
          })
          if (!formData2.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        }
        else if (tax.isTChecked) {
          const formData3 = await updateNursing({
            id: nursing?.id,
            amount: totalAmount.toString(),
            sum: sum.toString(),
            vTA: parseFloat(tax?.vTA),
          })
          if (!formData3.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        }
        else {
          const formData4 = await updateNursing({
            id: nursing?.id,
            amount: totalAmount.toString(),
            sum: sum.toString(),
          })
          if (!formData4.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        }
      }
      else toast.error('Ce dossier est clos.')
    }
    else toast.error('Aucun montant renseigné.')
  }

  return (
    <>
      {!nursing?.isCompleted &&
        <Form onSubmit={onSubmit} style={{ width: '60%' }} className='float-end pe-3'>
          <h5 className='card-title text-end mt-3' style={cardTitleStyle}>
            <i className='bi bi-currency-exchange'/> Paiement
          </h5>
          <FloatingLabel
            controlId="floatingInput"
            label={<>Montant à payer {currency && <>: {currency.value}</>}</>}
            className="mb-3">
            <Form.Control
              required
              disabled={loader}
              className='text-end'
              type='number'
              name='sum'
              value={sum}
              onChange={handleAmountChange} />
          </FloatingLabel>

          {nursing && !(nursing.vTA || nursing.discount) &&
            <div className='mb-3'>
              <Row className='mb-3'>
                <Col md={4}>
                  <Form.Check
                    id='isTChecked'
                    label={<><i className='bi bi-question-circle'/> TVA</>}
                    name='isTChecked'
                    value={tax.isTChecked}
                    disabled={loader}
                    onChange={onVTAClick}
                    checked={tax.isTChecked} />
                </Col>

                <Col m={8}>
                  <InputGroup>
                    <Form.Control
                      disabled={loader || !tax.isTChecked}
                      type='number'
                      className='text-end'
                      name='vTA'
                      value={tax.vTA}
                      onChange={onTaxChange} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Check
                    id='isDChecked'
                    label={<><i className='bi bi-question-circle'/> Remise</>}
                    name='isDChecked'
                    value={discount.isDChecked}
                    disabled={loader}
                    onChange={onDiscountClick}
                    checked={discount.isDChecked} />
                </Col>

                <Col m={8}>
                  <InputGroup>
                    <Form.Control
                      disabled={loader || !discount.isDChecked}
                      type='number'
                      className='text-end'
                      name='discount'
                      value={discount.discount}
                      onChange={(e) => handleChange(e, discount, setDiscount)} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            </div>}

          <div className='text-end'>
            <Button type='submit' variant='success' disabled={loader}>
              {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Procéder au paiement'}
            </Button>
          </div>
        </Form>}
    </>
  )
}

export default memo(NursingInvoiceForm)
