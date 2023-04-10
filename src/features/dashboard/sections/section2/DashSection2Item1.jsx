import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const defaultData = [
  {
    name: '01 au 05',
    fiches: 0,
    revenu: 0,
    patients: 0,
  },
  {
    name: '06 au 15',
    fiches: 0,
    revenu: 0,
    patients: 0,
  },
  {
    name: '16 au 21',
    fiches: 0,
    revenu: 0,
    patients: 0,
  },
  {
    name: '22 au 31',
    fiches: 0,
    revenu: 0,
    patients: 0,
  },
]

export const DashSection2Item1 = ({ stats, isOk = false }) => {
  return (
    <>
      <ResponsiveContainer width='100%' height='100%' children={
        <>
          <LineChart
            width={725}
            height={350}
            data={isOk && stats ? stats : defaultData}
            margin={{
              top: 30,
              left: 1,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="fiches" stroke="#4154F1" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="revenu" stroke="#2ECA6A" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="patients" stroke="#FF771D" activeDot={{ r: 8 }} />
          </LineChart>
        </>
      } />
    </>
  )
}
