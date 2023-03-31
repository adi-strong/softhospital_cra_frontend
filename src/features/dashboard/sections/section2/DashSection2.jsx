import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {AppDropdownFilerMenu} from "../../../../components";
import {useState} from "react";
import {DashSection2Item1} from "./DashSection2Item1";

export const DashSection2 = ({ menus }) => {
  const [key, setKey] = useState('Ce mois')
  const [component, setComponent] = useState({element: <DashSection2Item1/>})

  function onClick( name ) {
    switch (name) {
      case 'this-month':
        setKey(menus[0].label)
        setComponent({element: <DashSection2Item1/>})
        break
      case 'last-month':
        setKey(menus[1].label)
        setComponent({element: <div>Mois passé</div>})
        break
      case 'this-year':
        setKey(menus[2].label)
        setComponent({element: <div>Cette année</div>})
        break
      default:
        setKey(menus[0].label)
        setComponent({element: <DashSection2Item1/>})
        break
    }
  } // handle dropdown menu click

  return (
    <>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={menus}
          onClick={onClick} />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Rapports <span>| {key}</span></h5>
          {component.element}
        </Card.Body>
      </Card>
    </>
  )
}
