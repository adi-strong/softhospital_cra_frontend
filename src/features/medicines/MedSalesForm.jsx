import {AppDataTableBorderless, AppTHead} from "../../components";
import {Form} from "react-bootstrap";

const thead1 = [
  {label: 'n° doc'},
  {label: 'Désignation'},
  {label: 'Prix U.'},
  {label: 'Qté'},
  {label: 'P. Total'},
]

function DraftForm() {
  const onRefresh = () => { }

  function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <AppDataTableBorderless
          thead={<AppTHead isImg onRefresh={onRefresh} items={thead1}/>}
          tbody={<tbody/>} />
      </Form>
    </>
  )
}

export const MedSalesForm = () => {
  return (
    <>
      <DraftForm/>
    </>
  )
}
