import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddExams} from "./AddExams";

const exams = [
  {id: 3, name: 'Meares stamey (EPS et URO) + Prélèvement', category: 'Microbiologie', cost: 40, price: 50},
  {id: 2, name: 'B-HCG', category: 'Hormonologie', cost: 64, price: 65},
  {id: 1, name: 'Selles après colloration', category: 'Parasitologie', cost: 2, price: 3},
]

const ExamItem = ({exam}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-prescription2'/></td>
        <th scope='row'>{exam.id}</th>
        <td className='text-capitalize'>{exam.name}</td>
        <td>
          {exam?.category
            ? <Link to={`#!`} className='text-decoration-none'>{exam.category}</Link>
            : '-'}
        </td>
        <th scope='row'>
          {exam.cost.toFixed(2).toLocaleString()}
          <span className="text-secondary mx-1">USD</span>
        </th>
        <th scope='row'>
          {exam.price.toFixed(2).toLocaleString()}
          <span className="text-secondary mx-1">USD</span>
        </th>
        <td className='text-md-end'>
          <ButtonGroup>
            <Button type='button' variant='light' className='p-0 pe-1 px-1' title='Modification'>
              <i className='bi bi-pencil'/>
            </Button>
            <Button size='sm' variant='light' type='button' className='p-0 pe-1 px-1' title='Suppression'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const ExamsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewExam = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title='Liste des examens disponibles'
        overview={
          <>
            <p>
              {exams.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Il y a au total <code>{exams.length.toLocaleString()}</code> examens(s) enregistré(s) :</>}
            </p>
            <Col md={6}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewExam}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
              <Button type="button" variant='info' className='mb-1' disabled={exams.length < 1}>
                <i className='bi bi-printer'/> Impression
              </Button>
            </Col> {/* add new patient and printing's launch button */}
            <Col className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={exams.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={exams.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Libéllé'},
          {label: 'Catégorie'},
          {label: 'Coût'},
          {label: 'Prix'},
        ]}/>}
        tbody={
          <tbody>
          {exams && exams?.map(exam => <ExamItem key={exam.id} exam={exam}/>)}
          </tbody>
        } />

      <AddExams onHide={handleToggleNewExam} show={showNew} />
    </>
  )
}
