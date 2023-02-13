import {Card} from "react-bootstrap";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {ProvidersList} from "./ProvidersList";

function Providers() {
  return (
    <>
      <AppHeadTitle title='Pharmacie | Fournisseurs' />
      <AppBreadcrumb
        title='Fournisseurs des produits'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Card className='border-0'>
        <Card.Body>
          <ProvidersList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default Providers
