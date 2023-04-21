import {memo} from "react";
import {AppDataTableContents} from "../index";

function AppDataTableBordered(
  {
    loader = false,
    title,
    thead,
    tbody,
    overview,
    id,
    isStriped = false,
  }) {
  return <AppDataTableContents
    isBordered
    id={id}
    loader={loader}
    title={title}
    thead={thead}
    tbody={tbody}
    overview={overview}
    isStriped={isStriped} />
}

export default memo(AppDataTableBordered)
