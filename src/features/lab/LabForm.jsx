import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {RepeatableTableRows} from "../../loaders";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {LabVoucher} from "./LabVoucher";
import {AppRichText} from "../../components";
import {useUpdateLabMutation} from "./labApiSlice";

export const LabForm = ({ loader, allCategories, categoryLoader, user, isSuccess, data, isFetching, onRefetch }) => {
  const navigate = useNavigate()

  let prescriber
  prescriber = useMemo(() => isSuccess && data && data?.userPrescriber
    ? data.userPrescriber
    : null, [data, isSuccess])

  const [values, setValues] = useState([])
  const [comment, setComment] = useState('')
  const [draft, setDraft] = useState('')
  const [updateLab, {isLoading}] = useUpdateLabMutation()

  useEffect(() => {
    if (isSuccess && data) {
      if (data?.isPublished) {
        toast.error('😶', {
          icon: '❗',
          style: {
            background: 'orange',
            color: '#000'
          }
        })
        navigate('/member/treatments/lab', {replace: true})
      }
    }
  }, [isSuccess, data, navigate])

  useEffect(() => {
    if (isSuccess && data) {
      const obj = data?.labResults?.map(e => {return {id: e?.exam.id, result: '', wording: e?.exam.wording, normalValue: ''}})
      setValues(obj)
    }
  }, [isSuccess, data])

  function onChange(event, index) {
    const target = event.target
    const items = [...values]
    items[index][target.name] = target.value
    setValues(items)
  }

  const handleChangeComment = (newValue) => {
    setDraft(newValue)
    setComment(newValue)
  }
  const handleBlur = () => setComment(draft)

  async function onSubmit(e) {
    e.preventDefault()
    if (data && data?.id) {
      try {
        const submit = await updateLab({id: data?.id, comment, values})
        if (!submit.error) {
          toast.success('Analyses bien efféctuées.')
          onRefetch()
          navigate('/member/treatments/lab', {replace: true})
        }
      } catch (e) { }
    }
  }

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}><i className='fas fa-microscope'/> Laboratoire</h5>
          {(loader || isFetching) && <RepeatableTableRows />}
          <Form onSubmit={onSubmit}>
            {!(loader || isFetching) && data &&
              <div className='mt-3'>
                {values && values.length > 0 && values.map((v, idx) =>
                  <Row key={idx} className='mb-3'>
                    <Col md={4} className='mb-2' style={{ borderBottom: 'solid lightgray 1px' }}>
                      <h5 className='text-danger'><i className='fa fa-notes-medical'/> {v?.wording}</h5>
                    </Col>

                    <Col>
                      <Row>
                        <Col className='mb-1'>
                          <Form.Control
                            required
                            disabled={isLoading}
                            name='result'
                            placeholder='Résultat(s)'
                            value={v?.result}
                            onChange={(e) => onChange(e, idx)} />
                        </Col>
                        <Col className='mb-1'>
                          <Form.Control
                            disabled={isLoading}
                            name='normalValue'
                            placeholder='Valeur normale'
                            value={v?.normalValue}
                            onChange={(e) => onChange(e, idx)} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>)}
              </div>}
            <Row className='mt-2'>
              <Col md={4} />
              <Col>
                <Form.Label>Conclusion :</Form.Label>
                <AppRichText
                  onChange={handleChangeComment}
                  onBlur={handleBlur}
                  value={comment}
                  disabled={loader || isLoading} />

                <div className='text-end mt-3'>
                  <Button type='submit' disabled={isLoading || loader}>
                    <i className='bi bi-check me-1'/>
                    {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <LabVoucher
        allCategories={allCategories}
        loader={categoryLoader}
        prescriber={prescriber}
        data={data}
        onRefresh={onRefetch} />
    </>
  )
}
