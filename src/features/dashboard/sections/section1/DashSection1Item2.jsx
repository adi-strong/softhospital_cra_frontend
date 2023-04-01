import {Card} from "react-bootstrap";
import {useState} from "react";
import {AppDropdownFilerMenu} from "../../../../components";
import {DashTypes1} from "../../types/DashTypes1";

export const DashSection1Item2 = (
  {
    menus,
    stats,
    refetch,
    isFetching,
    onGetLasMonthStats,
    onGetThisMonthStats,
    onGetThisYearStats,
    currency,
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
      <Card className='border-0 info-card revenue-card'>
        <AppDropdownFilerMenu
          items={menus}
          onClick={onClick} />

        <Card.Body>
          <DashTypes1
            isFetching={isFetching}
            loadColor='#2ECA6A'
            color={
              stats && stats?.sum <= stats?.lastSum
                ? 'danger'
                : 'success'
            }
            title='Revenu'
            label={
              stats && stats?.sum <= stats?.lastSum
                ? 'baisse'
                : 'augmentation'
            }
            menu={key}
            icon={<span>{currency && currency?.value}</span>}
            num={stats
              ? <>{currency && currency?.value}{stats?.sum}</>
              : '--'}
            percent={stats ? stats?.revenueStat : ''} />
        </Card.Body>
      </Card>
    </>
  )
}
