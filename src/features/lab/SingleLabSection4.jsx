import parser from "html-react-parser";

export const SingleLabSection4 = ({ lab }) => {
  return (
    <>
      {lab?.comment && parser(lab.comment)}
    </>
  )
}
