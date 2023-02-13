import {Card} from "react-bootstrap";
import {AppDataTableStripped, AppTHead} from "../../components";
import {useMemo} from "react";

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'Prix'},
  {label: 'Qté'},
  {label: 'Unité C.'},
  {label: <><i className='bi bi-calendar-event-fill'/> Péremption</>},
  {label: <><i className='bi bi-calendar-event'/></>},
]

export const MedicinesList = () => {
  let content, errors
  content = useMemo(() => {
    return <tbody/>
  }, [])

  const onRefresh = async () => {}

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            loader={false}
            title='Liste de produits'
            tbody={content}
            thead={<AppTHead isImg loader={false} isFetching={false} onRefresh={onRefresh} items={thead}/>} />
          {errors && errors}
        </Card.Body>
      </Card>
    </>
  )
}
