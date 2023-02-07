import {AppFloatingInputField, AppFloatingSelectField} from "../../components";
import {Button} from "react-bootstrap";

export function BedroomForm(
  {
    isCategoriesLoad = false,
    isLoading = false,
    options,
    handleChangeBedroomCategory,
    bedroom,
    setBedroom,
    apiErrors,
    handleChange,
    onReset,
    data}) {
  return (
    <>
      <AppFloatingSelectField
        disabled={isCategoriesLoad || isLoading}
        className='mb-3 text-uppercase'
        options={options}
        onChange={handleChangeBedroomCategory}
        value={bedroom.category}
        name='category'
        label='Catégorie de la chambre' />
      <AppFloatingInputField
        required
        autofocus
        error={apiErrors.number}
        disabled={isLoading}
        name='number'
        value={bedroom.number}
        onChange={(e) => handleChange(e, bedroom, setBedroom)}
        placeholder='n° de la chambre'
        label='n° de la chambre' />
      <AppFloatingInputField
        required
        disabled={isLoading}
        error={apiErrors.description}
        text="Ce champs ne peut contenir que 53 caractère(s) maximum."
        maxLength={53}
        name='description'
        value={bedroom.description}
        onChange={(e) => handleChange(e, bedroom, setBedroom)}
        placeholder='Petite description de la chambre...'
        label='Petite description de la chambre...' />
      {!data &&
        <Button disabled={isLoading} type='reset' variant='light' className='w-100' onClick={onReset}>
          <i className='bi bi-trash3'/>
        </Button>}
    </>
  )
}
