import {DashSection3Item2} from "./DashSection3Item2";
import {DashSection3Item3} from "./DashSection3Item3";

const menus = [
  {label: 'Ce mois', name: 'this-month', action: '#'},
  {label: 'Mois passé', name: 'last-month', action: '#'},
  {label: 'Cette année', name: 'this-year', action: '#'},
  {label: 'Actualiser', name: 'refresh', action: '#'},
]

export const DashSection3 = () => {
  return (
    <>
      <DashSection3Item2 menus={menus}/>

      <DashSection3Item3 menus={menus}/>
    </>
  )
}
