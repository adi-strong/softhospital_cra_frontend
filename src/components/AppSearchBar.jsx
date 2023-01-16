import {memo, useState} from "react";
import PropTypes from "prop-types";

const AppSearchBar = ({show = false}) => {
  const [query, setQuery] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <div className={`search-bar ${show ? 'search-bar-show' : ''}`}>
        <form onSubmit={onSubmit} className="search-form d-flex align-items-center">
          <input
            type="text"
            name="query"
            value={query} placeholder="Recherche"
            onChange={({target}) => setQuery(target.value)}
            autoComplete='off'
            title="Entrer les mots clés"/>
          <button type="submit" title="Search">
            <i className="bi bi-search"/>
          </button>
        </form>
      </div>
    </>
  )
}

AppSearchBar.propTypes = {show: PropTypes.bool.isRequired}

export default memo(AppSearchBar)
