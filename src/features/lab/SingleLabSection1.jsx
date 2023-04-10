import parser from "html-react-parser";

export const SingleLabSection1 = ({ lab }) => {
  return (
    <>
      {lab?.descriptions && parser(`${lab.descriptions}`)}
    </>
  )
}
