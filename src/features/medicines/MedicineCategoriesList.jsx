import {AppDataTableStripped, AppTHead} from "../../components";
import {useMemo} from "react";
import {Card} from "react-bootstrap";

const thead = [{label: '#'}, {label: 'Désignation'}, {label: <><i className='bi bi-calendar-event'/> Date</>}]

export const MedicineCategoriesList = () => {
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
            title='Liste de catégories des produits'
            thead={<AppTHead isImg loader={false} isFetching={false} onRefresh={onRefresh} items={thead}/>}
            tbody={content} />
          {errors && errors}
        </Card.Body>
      </Card>
    </>
  )
}
