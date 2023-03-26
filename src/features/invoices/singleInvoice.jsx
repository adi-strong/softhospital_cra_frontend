import {memo, useEffect, useRef} from "react";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle, AppMainError} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useReactToPrint} from "react-to-print";
import {SingleInvoiceDetails} from "./SingleInvoiceDetails";
import {useGetSingleInvoiceQuery} from "./invoiceApiSlice";
import {useParams} from "react-router-dom";

const menus = [
  {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
  {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
]

export function roundANumber(num1, num2) {
  return parseFloat( parseInt(num1 * Math.pow(10, num2) + .5)) / Math.pow(10, num2)
}

function SingleInvoice() {
  const dispatch = useDispatch()
  const printRef = useRef()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/finance/invoices'))
  }, [dispatch])

  const handlePrint = useReactToPrint({content: () => printRef.current})

  const {id} = useParams()
  const {hospital} = useSelector(state => state.parameters) // we get hospital data infos
  const {data: invoice, isFetching, isError, refetch} = useGetSingleInvoiceQuery(id) // fetching invoice

  async function handleDropdownMenuClick(name: string) {
    if (name === 'refresh') await refetch()
    else handlePrint()
  }

  return (
    <div className='section dashboard'>
      <AppHeadTitle title={'Facture n°'} />
      <AppBreadcrumb title={'Facture n°'} links={[{path: '/member/finance/invoices', label: 'Liste de factures'}]} />

      <Card className='border-0'>
        <AppDropdownFilerMenu onClick={handleDropdownMenuClick} items={menus} heading='Action' />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-file-earmark-medical'/> Facture</h5>
          <div className='container-fluid' ref={printRef}>
            <SingleInvoiceDetails
              hospital={hospital}
              loader={isFetching}
              invoice={invoice} />
            {!(isFetching && invoice) && isError && <AppMainError/>}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleInvoice)
