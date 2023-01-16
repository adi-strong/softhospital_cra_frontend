import {memo, useEffect} from "react";
import PropTypes from 'prop-types';

const title = document.querySelector('title')
function setTitle(str: string) {
  title.innerText = 'SoftHospital / ' + str
}

const AppHeadTitle = ({title = ''}) => {
  useEffect(() => {
    if (title) {
      setTitle(title)
    }
  }, [title])
  return <></>
}

AppHeadTitle.propTypes = {title: PropTypes.string.isRequired}

export default memo(AppHeadTitle)
