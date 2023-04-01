import {Card} from "react-bootstrap";
import {useState} from "react";
import {AppDropdownFilerMenu} from "../../../../components";
import {DashTypes1} from "../../types/DashTypes1";

export const DashSection1Item3 = (
  {
    menus,
    stats,
    refetch,
    isFetching,
    onGetLasMonthStats,
    onGetThisMonthStats,
    onGetThisYearStats,
  }) => {
  const [key, setKey] = useState('Ce mois')

  function onClick( name ) {
    switch (name) {
      case 'this-month':
        setKey(menus[0].label)
        onGetThisMonthStats()
        break
      case 'last-month':
        setKey(menus[1].label)
        onGetLasMonthStats()
        break
      case 'this-year':
        setKey(menus[2].label)
        onGetThisYearStats()
        break
      default:
        setKey(menus[0].label)
        refetch()
        break
    }
  } // handle dropdown menu click

  return (
    <>
      <Card className='border-0 info-card customers-card'>
        <AppDropdownFilerMenu
          items={menus}
          onClick={onClick} />

        <Card.Body>
          <DashTypes1
            isFetching={isFetching}
            loadColor='#ff771d'
            color={
              stats && stats?.patients <= stats?.lastPatients
                ? 'danger'
                : 'success'
            }
            title='Patients'
            label={
              stats && stats?.patients <= stats?.lastPatients
                ? 'baisse'
                : 'augmentation'
            }
            menu={key}
            icon={<i className='bi bi-people'/>}
            num={stats ? parseInt(stats?.patients).toLocaleString() : '--'}
            percent={stats ? stats?.patientsStat : ''} />
        </Card.Body>
      </Card>
    </>
  )
}
