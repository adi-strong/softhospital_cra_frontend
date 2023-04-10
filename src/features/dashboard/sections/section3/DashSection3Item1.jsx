import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {useState} from "react";

export const DashSection3Item1 = () => {
  const [key] = useState('Ce mois')

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Finances <span>| {key}</span></h5>
        </Card.Body>
      </Card>
    </>
  )
}
