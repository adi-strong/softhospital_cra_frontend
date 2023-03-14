import {useState, useMemo, useEffect} from "react";
import {AppEditModal, AppInputGroupField, AppSelectOptions} from "../../components";
import {useUpdateMedicineMutation} from "./medicineApiSlice";
import {useLazyHandleLoadSubCategoriesOptionsQuery} from "./medicineSubCategoriesApiSlice";
import {useGetMedicineCategoriesQuery} from "./medicineCategoriesApiSlice";
import {useGetConsumptionUnitsQuery} from "./consumptionUnitApiSlice";
import toast from "react-hot-toast";
import {Col, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {requiredField} from "../covenants/addCovenant";

export function EditMedicineModal({show, onHide, data, currency}) {
  let apiErrors = {code: null, wording: null, cost: null, price: null,}
  const [medicine, setMedicine] = useState(data)
  const [options2, setOptions2] = useState([])
  const [category, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState(null)
  const [cUnit, setCUnit] = useState(null)
  const [updateMedicine, {isLoading, isError, error}] = useUpdateMedicineMutation()
  const [handleLoadSubCategoriesOptions, {isLoading: isSCLoading, isFetching: isSCFetching}] =
    useLazyHandleLoadSubCategoriesOptionsQuery()

  const {
    data: categories = [],
    isLoading: isCLoading,
    isFetching,
    isError: isCError} = useGetMedicineCategoriesQuery('MedicineCategories')
  const {
    data: cUnits = [],
    isLoading: isCULoading,
    isFetching: isCUFetching,
    isError: isCUError} = useGetConsumptionUnitsQuery('ConsumptionUnits')

  let options, options3
  if (isCError) alert('ERREUR: Erreur lors du chargement des catégories !!!')
  if (isCUError) alert('ERREUR: Erreur lors du chargement des unités de consommation !!!')

  options = useMemo(() => {
    if (!isCLoading && categories) return categories.map(category => {
      return {
        id: category.id,
        label: category?.wording,
        value: category['@id'],
      }
    })
  }, [isCLoading, categories])

  options3 = useMemo(() => {
    if (!isCULoading && cUnits) return cUnits.map(item => {
      return {
        id: item.id,
        label: item?.wording,
        value: item['@id'],
      }
    })
  }, [isCULoading, cUnits])

  useEffect(() => {
    if (data && data?.category) setCategory({
      label: data.category.wording,
      value: data.category['@id'],
    }) // handle get category

    if (data && data?.subCategory) setSubCategory({
      label: data.subCategory.wording,
      value: data.subCategory['@id'],
    }) // handle get subcategory

    if (data && data?.consumptionUnit) setCUnit({
      label: data.consumptionUnit.wording,
      value: data.consumptionUnit['@id'],
    }) // handle get consumption unit
  }, [data])

  async function onLoadSubcategories(id) {
    try {
      const sCData = await handleLoadSubCategoriesOptions(id).unwrap()
      setOptions2(sCData)
    }
    catch (e) { toast.error(e.message) }
  }

  function handleChangeCategory(event) {
    setSubCategory(null)
    if (event) {
      setCategory(event)
      onLoadSubcategories(event.id)
    }
    else {
      setCategory(null)
      setSubCategory(null)
    }
  }

  const onSubmit = async () => {
    apiErrors = {code: null, wording: null, cost: null, price: null,}
    try {
      const formData = await updateMedicine({...medicine,
        category: category,
        subCategory: subCategory,
        consumptionUnit: cUnit})
      if (!formData.error) {
        toast.success('Enregistrement bien efféctué.')
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppEditModal
        size='lg'
        loader={isLoading}
        show={show}
        onHide={onHide}
        onEdit={onSubmit}>

        <Row>
          <Col md={6}>
            <AppInputField
              required
              autofocus
              disabled={isLoading}
              value={medicine.wording}
              name='wording'
              onChange={(e) => handleChange(e, medicine, setMedicine)}
              error={apiErrors.wording}
              label={<>Désignation {requiredField}</>} />
            <AppInputField
              disabled={isLoading}
              value={medicine.code}
              name='code'
              onChange={(e) => handleChange(e, medicine, setMedicine)}
              error={apiErrors.wording}
              label={<><i className='bi bi-qr-code'/> Code produit</>} />

            <AppInputGroupField
              isTextBefore
              isTextAfter
              textBefore={currency ? currency.currency : ''}
              textAfter={currency ? currency.value : ''}
              type='number'
              label='Coût'
              name='cost'
              value={medicine.cost}
              onChange={(e) => handleChange(e, medicine, setMedicine)}
              disabled={isLoading}
              error={apiErrors.cost} />

            <AppInputGroupField
              isTextBefore
              isTextAfter
              textBefore={currency ? currency.currency : ''}
              textAfter={currency ? currency.value : ''}
              type='number'
              label='Prix'
              name='price'
              value={medicine.price}
              onChange={(e) => handleChange(e, medicine, setMedicine)}
              disabled={isLoading}
              error={apiErrors.price} />
          </Col>

          <Col md={6}>
            <div className='mb-3'>
              <AppSelectOptions
                label='Catégorie'
                disabled={isLoading || isCLoading || isFetching}
                options={options}
                onChange={(e) => handleChangeCategory(e)}
                value={category}
                name='category'
                placeholder='-- Catégoie --' />
            </div>

            <div className='mb-3'>
              <AppSelectOptions
                label='Sous-categorie'
                disabled={isLoading || isSCLoading || isSCFetching}
                options={options2}
                onChange={(e) => setSubCategory(e)}
                value={subCategory}
                name='subCategory'
                placeholder='-- Sous-catégorie --' />
            </div>

            <div className='mb-3'>
              <AppSelectOptions
                label='Unité de consommation'
                disabled={isLoading || isCULoading || isCUFetching}
                options={options3}
                onChange={(e) => setCUnit(e)}
                value={cUnit}
                name='cUnit'
                placeholder='-- Unité de consommation --' />
            </div>
          </Col>
        </Row>

      </AppEditModal>
    </>
  )
}
