import {memo} from "react";
import {useGetBoxQuery} from "./boxApiSlice";
import {Spinner} from "react-bootstrap";
import {AppMainError} from "../../components";
import BoxSum from "./BoxSum";

function Box() {
  const {data: boxes = [], isLoading: loadBoxes, isError: isBoxError, isSuccess: isDone} = useGetBoxQuery('Box')

  let box, boxError
  if (loadBoxes) box = <div className='mb-3'><Spinner animation='border' size='sm'/></div>
  else if (isBoxError) boxError = <AppMainError/>
  else if (isDone) box = boxes && <BoxSum id={boxes.ids[0]}/>

  return (
    <>
      {box}
      {boxError && boxError}
      <div className='mb-3' style={{ border: 'dotted 3px lightgray', borderBottom: 'none' }} />
    </>
  )
}

export default memo(Box)
