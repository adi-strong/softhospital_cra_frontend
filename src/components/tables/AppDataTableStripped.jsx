import {memo} from "react";
import {AppDataTableContents} from "../index";

const AppDataTableStripped = (
  {
    title,
    thead,
    tbody,
    overview,
  }) => {
  return <AppDataTableContents overview={overview} title={title} tbody={tbody} thead={thead} isStriped />
}

export default memo(AppDataTableStripped)
