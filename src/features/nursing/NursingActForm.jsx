import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import toast from "react-hot-toast";
import {useUpdateNursingMutation} from "./nursingApiSlice";

export const NursingActForm = ({ data, onLoad, handleComment, handleBlur, comment, onRefresh, setLoader, loader = false }) => {
  const [acts, setActs] = useState([])
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()

  useEffect(() => {
    if (data && data?.acts && data.acts.length > 0) {
      const items = data.acts
      const obj = []
      for (const key in items) {
        const item = items[key]

        let procedures = []
        if (item?.procedures && item.procedures.length > 0) {
          for (let i = 0; i < item.procedures.length; i++) {
            procedures.push({
              item: item.procedures[i]?.item,
              quantity: item.procedures[i]?.quantity})
          }
        }

        obj.push({
          procedures,
          isDone: item?.isDone,
          wording: item.wording,
          releasedAt: item?.releasedAt})
      }
      setActs(obj)
    }
  }, [data]) // handle get acts data

  const onAddItem = index => {
    const values = [...acts]
    values[index]['procedures'].push({item: '', quantity: ''})
    setActs(values)
  }

  const onRemoveItem = (index, key) => {
    const values = [...acts]
    const items = values[index]['procedures']
    items.splice(key, 1)
    values[index]['procedures'] = items
    setActs(values)
  }

  const handleChangeItem = (event, index, key) => {
    const values = [...acts]
    const items = values[index]
    const procedures = items?.procedures
    procedures[key][event.target.name] = event.target.value
    values[index]['procedures'] = procedures
    setActs(values)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (acts && acts.length > 0) {
      try {
        setLoader(true)
        const submit = await updateNursing({acts: acts.length > 0
            ? acts.map(a => {
              return {
                ...a,
                isDone: true,
              }
            })
            : [],
          id: data?.id})
        if (!submit.error) {
          setLoader(false)
          toast.success('Opération bien efféctuée.')
          onRefresh()
        }
      } catch (e) { setLoader(false) }
    }
    else toast.error("Aucun acte médical renseigné.")
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        {!loader && data &&
          <>
            {acts && acts.length > 0 && acts.map((act, idx) => (!act?.isDone) &&
              <Row
                key={idx}
                className='mx-3 me-3 bg-light p-2 mb-2' style={{ border: '1px solid lightgray', borderRadius: 6 }}>
                <Col md={4}>
                  <h5 className='card-title text-capitalize fw-bold' style={cardTitleStyle}>
                    <i className='bi bi-journal-plus'/> {act?.wording}
                  </h5> <hr/>
                  <div className="text-end text-primary"><i className='bi bi-arrow-bar-right'/></div>
                </Col>

                <Col md={8} className='bg-secondary-light'>
                  <h6 className="text-center text-primary mt-2 fw-bold"><i className='bi bi-caret-down-fill'/> Procédure</h6>
                  {act?.procedures && act.procedures.length > 0 && act.procedures.map((p, key) =>
                    <div key={key} className='mb-3'>
                      <InputGroup>
                        <InputGroup.Text>Libellé</InputGroup.Text>
                        <Form.Control
                          required
                          autoComplete='off'
                          disabled={isLoading}
                          name='item'
                          value={p?.item}
                          onChange={(e) => handleChangeItem(e, idx, key)} />

                        <InputGroup.Text>Dosage / Quantité</InputGroup.Text>

                        <Form.Control
                          required
                          autoComplete='off'
                          disabled={isLoading}
                          name='quantity'
                          className='text-end'
                          value={p?.quantity}
                          onChange={(e) => handleChangeItem(e, idx, key)} />
                        {act?.procedures && act.procedures.length > 1 &&
                          <Button type='button' variant='outline-danger' onClick={() => onRemoveItem(idx, key)}>
                            <i className='bi bi-x'/>
                          </Button>}
                      </InputGroup>
                    </div>)}

                  <div className='text-end mb-3'>
                    <Button type='button' variant='dark' onClick={() => onAddItem(idx)}>
                      <i className='bi bi-plus'/>
                    </Button>
                  </div>
                </Col>
              </Row>)}
          </>}

        {acts && acts.length > 0 &&
          <div className='text-end me-3'>
            <Button type='submit' disabled={isLoading}>
              <i className='bi bi-check me-1'/>
              {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
            </Button>
          </div>}
      </Form>
    </>
  )
}
