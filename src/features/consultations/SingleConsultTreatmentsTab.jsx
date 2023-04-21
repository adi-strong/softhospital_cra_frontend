import {Button, Form, Spinner, Table} from "react-bootstrap";
import {AppDataTableBordered, AppRichText, AppTHead} from "../../components";
import {useEffect, useMemo, useState} from "react";
import moment from "moment";
import {RepeatableTableRows} from "../../loaders";
import toast from "react-hot-toast";
import {useUpdateConsultationTreatmentsDescriptionsMutation} from "./consultationApiSlice";

const thead = [{label: 'DATE'}, {label: 'TRAITEMENT'}]

const ActTreatmentItem = ({ act }) => {
  return (
    <>
      <tr>
        {act?.item && <th className='text-capitalize'>{moment(act.item).format('ll')}</th>}
        <td className='text-end'>
          {act?.values && act.values?.length > 0 && act.values?.map((a, key) =>
            <p key={key} className='text-capitalize'>
              {a?.wording}
            </p>)}
        </td>
      </tr>
    </>
  )
}

export const SingleConsultTreatmentsTab = ({ data, onRefresh, loader = false }) => {
  let actsItems, followedItems, isComplete = !!(data && data?.isComplete)
  actsItems = useMemo(() => {
    if (data && data?.invoice && data.invoice?.actsInvoiceBaskets) {
      const items = data.invoice?.actsInvoiceBaskets
      const groups = new Map()
      items?.forEach(item => {
        if (item?.date) {
          const act = item
          if (groups?.has(act?.date)) {
            groups.get(act.date).push({wording: act?.act ? act.act?.wording : ''})
          }
          else {
            groups.set(act?.date, [{wording: act?.act ? act.act?.wording : ''}])
          }
        }
      })

      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return []
  }, [data])

  followedItems = useMemo(() => {
    if (data && data?.followed) {
      const items = data.followed
      const groups = new Map()
      items?.forEach(item => {
        if (item?.date) {
          const follow = item
          if (groups?.has(follow?.date)) {
            groups.get(follow.date).push({
              date: follow?.date ? follow.date : null,
              weight: follow?.weight ? follow.weight : null,
              temperature: follow?.temperature ? follow.temperature : null,
              arterialTension: follow?.arterialTension ? follow.arterialTension : null,
              cardiacFrequency: follow?.cardiacFrequency ? follow.cardiacFrequency : null,
              oxygenSaturation: follow?.oxygenSaturation ? follow.oxygenSaturation : null,
              respiratoryFrequency: follow?.respiratoryFrequency ? follow.respiratoryFrequency : null})
          }
          else {
            groups.set(follow?.date, [{
              date: follow?.date ? follow.date : null,
              weight: follow?.weight ? follow.weight : null,
              temperature: follow?.temperature ? follow.temperature : null,
              arterialTension: follow?.arterialTension ? follow.arterialTension : null,
              cardiacFrequency: follow?.cardiacFrequency ? follow.cardiacFrequency : null,
              oxygenSaturation: follow?.oxygenSaturation ? follow.oxygenSaturation : null,
              respiratoryFrequency: follow?.respiratoryFrequency ? follow.respiratoryFrequency : null}])
          }
        }
      })

      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return []
  }, [data])

  const [treatmentsDescriptions, setTreatmentsDescriptions] = useState('')
  const [draft, setDraft] = useState('')
  const [updateConsultationTreatmentsDescriptions, {isLoading}] = useUpdateConsultationTreatmentsDescriptionsMutation()

  const handleChange = (newValue) => {
    setDraft(newValue)
    setTreatmentsDescriptions(newValue)
  }

  const handleBlur = () => setTreatmentsDescriptions(draft)

  useEffect(() => {
    if (data && data?.treatmentsDescriptions) setTreatmentsDescriptions(data.treatmentsDescriptions)
  }, [data])

  async function onSubmit() {
    if (data && data?.id) {
      if (isComplete) toast.success('Ce dossier est clos.')
      else {
        const submit = await updateConsultationTreatmentsDescriptions({ id: data.id, treatmentsDescriptions })
        if (!submit?.error) {
          toast.success('Opération bien efféctuée.')
          onRefresh()
        }
      }
    }
  }

  return (
    <>
      <AppDataTableBordered
        loader={loader}
        thead={<AppTHead items={thead} className='bg-primary text-light text-center' style={{ fontSize: '0.6rem' }} />}
        tbody={
          <tbody>
            {actsItems && actsItems?.length > 0 &&
              actsItems?.map((item, idx) => <ActTreatmentItem key={idx} act={item} />)}
          </tbody>} />

      <Table bordered responsive style={{ fontSize: '0.8rem' }}>
        <thead>
        <tr className='text-center bg-primary text-light'><th colSpan={6}>SIGNES VITAUX</th></tr>
        <tr className='bg-dark text-light'>
          <th>Date</th>
          <th className='text-center'>T°</th>
          <th className='text-center'>T.A</th>
          <th className='text-center'>F.C</th>
          <th className='text-center'>Poids</th>
        </tr>
        </thead>
        <tbody>
        {followedItems && followedItems?.length > 0 && followedItems?.map((f, idx) =>
          <tr key={idx}>
            <th>{f?.item && moment(f.item).calendar()}</th>
            <td className='text-center'>
              {f?.values && f.values?.length > 0 && f.values?.map((v, key) =>
                v?.temperature && v.temperature > 0 && <p key={key}>{v.temperature}°</p>)}
            </td>
            <td className='text-center'>
              {f?.values && f.values?.length > 0 && f.values?.map((v, key) =>
                v?.arterialTension && <p key={key}>{v.arterialTension}</p>)}
            </td>
            <td className='text-center'>
              {f?.values && f.values?.length > 0 && f.values?.map((v, key) =>
                v?.cardiacFrequency && <p key={key}>{v.cardiacFrequency}</p>)}
            </td>
            <td className='text-end'>
              {f?.values && f.values?.length > 0 && f.values?.map((v, key) =>
                v?.weight && v.weight > 0 && <p key={key}>{v.weight} Kg</p>)}
            </td>
          </tr>)}
        </tbody>
      </Table>
      {loader && <RepeatableTableRows/>}

      <div className='mt-2'>
        <Form.Label>C.A.T & Traitements</Form.Label>
        <AppRichText
          onChange={handleChange}
          onBlur={handleBlur}
          value={treatmentsDescriptions}
          disabled={loader || isLoading} />
      </div>

      <div className="mt-3 text-end">
        <Button type='button' disabled={loader || isLoading} onClick={onSubmit}>
          <i className='bi bi-check me-1'/>
          {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm' /></>}
        </Button>
      </div>
      {loader && <RepeatableTableRows/>}
    </>
  )
}
