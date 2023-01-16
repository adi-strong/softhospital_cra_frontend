import {useState} from "react";
import img1 from '../../assets/app/img/bedrooms/1.jpg';
import img2 from '../../assets/app/img/bedrooms/2.jpg';
import img3 from '../../assets/app/img/bedrooms/3.jpg';
import img4 from '../../assets/app/img/bedrooms/4.jpg';
import img5 from '../../assets/app/img/bedrooms/5.jpg';
import img6 from '../../assets/app/img/bedrooms/6.jpg';
import img7 from '../../assets/app/img/bedrooms/7.webp';
import {Button, ButtonGroup, Col, Form, InputGroup, Row} from "react-bootstrap";
import {style} from "./BedsList";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddBedroom} from "./AddBedroom";

const elements = [img1, img2, img3, img4, img5, img6, img7]

const bedrooms = [
  {id: 3, wording: '09K LL', category: 'Normale', description: 'Repellat fugiat adipisci nemo illum nesciunt voluptas.'},
  {id: 2, wording: '12', category: 'Standard', description: 'Voluptas necessitatibus occaecati quia. Earum totam.'},
  {id: 1, wording: '001-a', category: 'VIP', description: 'Magni qui quod omnis unde et eos fuga et exercitationem.'},
]

const BedroomItem = ({bedroom}) => {
  const randomImg = Math.floor(Math.random() * elements.length)

  return (
    <>
      <Col key={bedroom.id} md={6} lg={4}>
        <div className='bed'>
          <img src={elements[randomImg]} className="img-fluid" alt="" style={style}/>
          <div className='bed-content'>
            <h4>{bedroom.wording}</h4>
            <span>{bedroom.category}</span>
            <div>
              {bedroom.description}

              <div className='mb-2'>
                <ButtonGroup size='sm'>
                  <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Modification'>
                    <i className='bi bi-pencil text-primary'/>
                  </Button>
                  <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Suppression'>
                    <i className='bi bi-trash text-danger'/>
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  )
}

export const BedroomsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewBedroom = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <p>Il y au total <code>{bedrooms.length}</code> chambre(s) :</p>
      <Row className='mb-4'>
        <Col md={8} className=' mb-1'>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Button type='submit' variant='light' disabled={bedrooms.length < 1}>
                <i className='bi bi-search'/>
              </Button>
              <Form.Control
                placeholder='Votre recherche ici...'
                aria-label='Votre recherche ici...'
                autoComplete='off'
                disabled={bedrooms.length < 1}
                name='search'
                value={keywords.search}
                onChange={(e) => handleChange(e, keywords, setKeywords)} />
            </InputGroup>
          </form>
        </Col> {/* search bar */}
        <Col md={4} className='text-md-end mb-1'>
          <Button type='button' variant='secondary' className='me-1' onClick={handleToggleNewBedroom}>
            <i className='bi bi-plus'/> Enregistrer
          </Button>
          <Button type='button' className='me-1' onClick={onRefresh}>
            <i className='bi bi-arrow-clockwise'/>
          </Button>
        </Col>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>
        {bedrooms && bedrooms?.map(bedroom => <BedroomItem key={bedroom.id} bedroom={bedroom}/>)}
      </Row>

      <AddBedroom onHide={handleToggleNewBedroom} show={showNew} />
    </>
  )
}
