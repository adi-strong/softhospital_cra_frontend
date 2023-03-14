import {useParams} from "react-router-dom";
import {AppBreadcrumb, AppHeadTitle, AppMainError} from "../../../components";
import {Button, Card} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useGetSingleMedicineInvoiceQuery} from "../../invoices/medicineInvoiceApiSlice";
import {PrintingMedicineInvoiceHeader} from "./printingMedicineInvoiceHeader";
import {PrintingMedicineInvoiceContent} from "./printingMedicineInvoiceContent";
import {useEffect, useRef} from "react";
import {onInitSidebarMenu} from "../../navigation/navigationSlice";
import { useReactToPrint } from "react-to-print";

function PrintingMedicineInvoice() {
  const dispatch = useDispatch()
  const { id, invoiceNumber } = useParams()
  const { hospital, fCurrency } = useSelector(state => state.parameters)
  const {data: invoice = null, isLoading, isSuccess, isError} = useGetSingleMedicineInvoiceQuery(id)

  const printRef = useRef()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/drugstore/medicines'))
  }, [dispatch])

  const handlePrint = useReactToPrint({ content: () => printRef.current })

  return (
    <>
      <AppHeadTitle title='Phramacie | Factures' />
      <AppBreadcrumb
        title={`Facture n° ${invoiceNumber || id}`}
        links={[
          {path: '/member/drugstore/medicines', label: 'Liste des produits'},
          {path: '/member/drugstore/invoices', label: 'Liste des factures'},
        ]} />

      <div className='text-end mb-3'>
        <Button type='button' variant='info' onClick={handlePrint}>
          <i className='bi bi-printer'/> Impréssion
        </Button>
      </div>

      <Card className='border-0'>
        <Card.Body className='p-0'>
          {!isError &&
            <>
              <div id='printing-body' className='bg-light' ref={printRef}>
                <PrintingMedicineInvoiceHeader
                  isLoading={isLoading}
                  invoice={invoice}
                  isSuccess={isSuccess}
                  id={id}
                  invoiceNumber={invoiceNumber}
                  hospital={hospital} />

                <PrintingMedicineInvoiceContent isLoading={isLoading} invoice={invoice} currency={fCurrency} />
              </div>
            </>}
          {isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </>
  )
}

export default PrintingMedicineInvoice
