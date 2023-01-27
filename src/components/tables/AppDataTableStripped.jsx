import {memo} from "react";
import {AppDataTableContents} from "../index";

const AppDataTableStripped = (
  {
    title,
    thead,
    tbody,
    overview,
    loader = false
  }) => {
  return (
    <>
      <AppDataTableContents
        overview={overview}
        title={title}
        tbody={tbody}
        thead={thead}
        loader={loader}
        isStriped />
    </>
  )
}

export default memo(AppDataTableStripped)
