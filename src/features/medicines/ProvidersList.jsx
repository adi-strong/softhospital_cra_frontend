import {useMemo} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'n° Tél.'},
  {label: 'Email'},
  {label: 'P. Focal'},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export const ProvidersList = () => {
  let content, errors
  content = useMemo(() => {
    return <tbody/>
  }, [])

  const onRefresh = async () => {}

  return (
    <>
      <AppDataTableStripped
        loader={false}
        title='Liste des fournisseurs de produits'
        thead={<AppTHead isImg loader={false} isFetching={false} onRefresh={onRefresh} items={thead}/>}
        tbody={content} />
      {errors && errors}
    </>
  )
}
