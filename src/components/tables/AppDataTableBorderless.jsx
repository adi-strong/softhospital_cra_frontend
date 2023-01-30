import {memo} from "react";
import {AppDataTableContents} from "../index";

const AppDataTableBorderless = (
  {
    loader = false,
    title,
    thead,
    tbody,
    overview,
    isStriped = false,
  }) => {
  return <AppDataTableContents
    loader={loader}
    title={title}
    thead={thead}
    tbody={tbody}
    overview={overview}
    isStriped={isStriped}
    isBorderless />
}

export default memo(AppDataTableBorderless)
