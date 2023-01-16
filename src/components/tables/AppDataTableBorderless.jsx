import {memo} from "react";
import {AppDataTableContents} from "../index";

const AppDataTableBorderless = (
  {
    title,
    thead,
    tbody,
    overview,
    isStriped = false,
  }) => {
  return <AppDataTableContents
    title={title}
    thead={thead}
    tbody={tbody}
    overview={overview}
    isStriped={isStriped}
    isBorderless />
}

export default memo(AppDataTableBorderless)
