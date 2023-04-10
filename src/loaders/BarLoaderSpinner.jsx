import {memo} from "react";
import {BarLoader} from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#566ef5",
};

const BarLoaderSpinner = ({loading = false}) => {
  return (
    <div className='text-center'>
      <BarLoader
        color='#475fd2'
        cssOverride={override}
        size={30}
        loading={loading}
        aria-label="Loading Spinner"
        data-testid="loader" />
    </div>
  )
}

export default memo(BarLoaderSpinner)

