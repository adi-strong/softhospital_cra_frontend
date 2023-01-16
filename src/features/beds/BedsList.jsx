import {useState} from "react";
import {Button, ButtonGroup, Col, Form, InputGroup, Row} from "react-bootstrap";
import img1 from '../../assets/app/img/beds/1.jpg';
import img2 from '../../assets/app/img/beds/2.jpg';
import img3 from '../../assets/app/img/beds/3.jpg';
import img4 from '../../assets/app/img/beds/4.jpg';
import img5 from '../../assets/app/img/beds/5.jpg';
import img6 from '../../assets/app/img/beds/6.jpg';
import img7 from '../../assets/app/img/beds/7.jpg';
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddBed} from "./AddBed";

const elements = [img1, img2, img3, img4, img5, img6, img7]

const beds = [
  {id: 3, wording: 'ac 16b', bedroom: '001-a', description: 'Magni qui quod omnis unde et eos fuga et exercitationem.'},
  {id: 2, wording: 'zz 8', bedroom: '12', description: 'Repellat fugiat adipisci nemo illum nesciunt voluptas.'},
  {id: 1, wording: 'pg baddas', bedroom: '09K LL', description: 'Voluptas necessitatibus occaecati quia. Earum totam.'},
]

export const style = {
  width: '100%',
  height: 200.96,
}

const BedItem = ({bed}) => {
  const randomImg = Math.floor(Math.random() * elements.length)

  return (
    <Col key={bed.id} md={6} lg={4}>
      <div className='bed'>
        <img src={elements[randomImg]} className="img-fluid" alt="" style={style}/>
        <div className='bed-content'>
          <h4>{bed.wording}</h4>
          <span>{bed.bedroom}</span>
          <div>
            {bed.description}

            <div>
              <ButtonGroup size='sm'>
                <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Modification'>
                  <i className='bi bi-pencil text-primary'/>
                </Button>
                <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Suppression'>
                  <i className='bi bi-trash text-danger'/>
                </Button>
              </ButtonGroup>
            </div>

            <hr/>

            <p>
              <b><i className='bi bi-cash-coin'/> Prix : 200 USD</b>
            </p>
          </div>
          <p className='mt-3'>
            <mark className={`success`}>
              <i className='bi bi-check-circle text-white'/> disponible
            </mark>
          </p>
        </div>
      </div>
    </Col>
  )
}

export const BedsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewBed = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <p>Il y a au total <code>{beds.length}</code> lit(s) enregistré(s) :</p>
      <Row className='mb-4'>
        <Col md={8} className=' mb-1'>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Button type='submit' variant='light' disabled={beds.length < 1}>
                <i className='bi bi-search'/>
              </Button>
              <Form.Control
                placeholder='Votre recherche ici...'
                aria-label='Votre recherche ici...'
                autoComplete='off'
                disabled={beds.length < 1}
                name='search'
                value={keywords.search}
                onChange={(e) => handleChange(e, keywords, setKeywords)} />
            </InputGroup>
          </form>
        </Col> {/* search bar */}
        <Col md={4} className='text-md-end mb-1'>
          <Button type='button' variant='secondary' className='me-1' onClick={handleToggleNewBed}>
            <i className='bi bi-plus'/> Enregistrer
          </Button>
          <Button type='button' className='me-1' onClick={onRefresh}>
            <i className='bi bi-arrow-clockwise'/>
          </Button>
        </Col>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>
        {beds && beds?.map(bed => <BedItem key={bed.id} bed={bed}/>)}
      </Row>

      <AddBed onHide={handleToggleNewBed} show={showNew} />
    </>
  )
}
