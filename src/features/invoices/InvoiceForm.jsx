import {Button, Col, FloatingLabel, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {roundANumber} from "./singleInvoice";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const InvoiceForm = (
  {
    loader,
    tax,
    setTax,
    discount,
    setDiscount,
    onSubmit,
    currency,
    form,
    setForm,
    onTaxChange,
    consult,
    invoice,
    totalAmount,
    setNetPayable,
  }) => {
  const hospitalization = consult && consult?.hospitalization
  const leaveAt = hospitalization ? hospitalization.isCompleted : false
  const isComplete = !!(invoice && invoice?.isComplete)

  const handleAmountChange = ({ target }) => {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    setForm({...form, sum: value})
  }

  const onLeaveBedroomClick = () => setForm({...form, isBedroomLeaved: !form.isBedroomLeaved})

  const onCompleteInvoiceClick = () => {
    const value = !form.isComplete
    setForm({
      ...form,
      isComplete: value,
      isBedroomLeaved: value ? value : false
    })
  }

  const onVTAClick = () => {
    if (invoice) {
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
    if (invoice) {
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

  return (
    <>
      {invoice && !invoice?.isComplete &&
        <Form onSubmit={onSubmit} style={{ width: '60%' }} className='float-end'>
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
              value={form.sum}
              onChange={handleAmountChange} />
          </FloatingLabel>

          {invoice && !(invoice.vTA || invoice.discount) &&
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

          {!leaveAt && hospitalization &&
            <Form.Check
              name='isBedroomLeaved'
              value={form.isBedroomLeaved}
              onChange={onLeaveBedroomClick}
              checked={form.isBedroomLeaved}
              disabled={loader || form.isComplete}
              className='mb-3'
              id='isBedroomLeaved'
              label={<><i className='bi bi-question-circle'/> Libérer le lit (la chambre)</>} />}

          {!isComplete &&
            <Form.Check
              name='isComplete'
              value={form.isComplete}
              onChange={onCompleteInvoiceClick}
              checked={form.isComplete}
              disabled={loader}
              className='mb-3'
              id='isComplete'
              label={<><i className='bi bi-question-circle'/> Clôturer la facture</>} />}

          <div className='text-end'>
            <Button type='submit' variant='success' disabled={loader}>
              {loader
                ? <>Traitement en cours <Spinner animation='border' size='sm'/></>
                : 'Procéder au paiement'}
            </Button>
          </div>
        </Form>}
    </>
  )
}
