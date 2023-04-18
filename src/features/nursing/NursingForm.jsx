import {Button, Card, Spinner, Tab, Tabs} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useEffect, useState} from "react";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {NursingActForm} from "./NursingActForm";
import PatientInfos from "../patients/PatientInfos";
import {NursingTreatmentForm} from "./NursingTreatmentForm";
import {NursingFollowForm} from "./NursingFollowForm";

const tabs = [
  {label: 'Premier(s) soin(s)', eventKey: 'first'},
  {eventKey: 'second', label: 'Actes médicaux'},
  {eventKey: 'last', label: 'Suivi et Commentaire(s)'}]

export function NursingForm({ data, onRefresh, isError = false, loader = false}) {
  const [key, setKey] = useState('second')
  const [comment, setComment] = useState('')
  const [draft, setDraft] = useState('')
  const [onLoad, setOnLoad] = useState(false)

  const handleComment = (newValue) => {
    setDraft(newValue)
    setComment(newValue)
  }

  const handleBlur = () => setComment(draft)

  useEffect(() => {
    if (data && data?.comment) setComment(data.comment)
  }, [data])

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>
            Dossier n°{data && ` #${data?.nursingNumber}`}
          </h5>

          {data && data?.patient &&
            <div className='mb-4'>
              <PatientInfos patient={data.patient} />
            </div>}

          <div>
            <Button type='button' variant='light' disabled={loader} onClick={onRefresh}>
              <i className='bi bi-arrow-clockwise'/> Actualiser{' '}
              {loader && <Spinner animation='border' size='sm'/>}
            </Button>
          </div>

          <Tabs onSelect={k => setKey(k)} activeKey={key} variant='tabs-bordered' className='mb-3'>
            {tabs && tabs.length > 0 && tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.label} eventKey={tab.eventKey} className='pt-3'>
                {tab.eventKey === 'second' &&
                  <NursingActForm
                    handleBlur={handleBlur}
                    onLoad={onLoad}
                    handleComment={handleComment}
                    data={data}
                    setLoader={setOnLoad}
                    onRefresh={onRefresh}
                    loader={loader}
                    comment={comment} />}
                {tab.eventKey === 'first' &&
                  <NursingTreatmentForm
                    data={data}
                    setLoader={setOnLoad}
                    onRefresh={onRefresh}
                    loader={loader}
                    comment={comment}/>}
                {tab.eventKey === 'last' &&
                  <NursingFollowForm
                    handleComment={handleComment}
                    handleBlur={handleBlur}
                    setLoader={setOnLoad}
                    onRefresh={onRefresh}
                    data={data}
                    onLoad={onLoad}
                    comment={comment}
                    loader={loader} />}
              </Tab>)}
          </Tabs>

          {loader && <BarLoaderSpinner loading={loader}/>}
        </Card.Body>
      </Card>
    </>
  )
}
