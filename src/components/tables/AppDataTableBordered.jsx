import {memo} from "react";
import {AppDataTableContents} from "../index";

function AppDataTableBordered(
  {
    loader = false,
    title,
    thead,
    tbody,
    overview,
    isStriped = false,
  }) {
  return <AppDataTableContents
    isBordered
    loader={loader}
    title={title}
    thead={thead}
    tbody={tbody}
    overview={overview}
    isStriped={isStriped} />
}

export default memo(AppDataTableBordered)
