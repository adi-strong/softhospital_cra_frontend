import {memo} from "react";
import ReactPaginate from "react-paginate";

function AppPaginationComponent(
  {
    className = 'pagination pagination-sm justify-content-center mt-4',
    pageCount = 1,
    onPaginate,
    currentPage,
    pageRangeDisplayed = 3,
    nextLabel = 'Suivant',
    previousLabel = 'Précédent'
  }) {

  const handlePageClick  = (event) => {
    onPaginate(event.selected)
  }

  return (
    <>
      <ReactPaginate
        renderOnZeroPageCount={null}
        nextLabel={<>{nextLabel+' '}<i className='bi bi-chevron-right'/></>}
        previousLabel={<><i className='bi bi-chevron-left'/><> {previousLabel}</></>}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={handlePageClick}
        breakLabel='...'
        className={className}
        pageClassName='page-item'
        pageLinkClassName='page-link'
        activeClassName='active'
        breakClassName='page-item fw-bold'
        breakLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        forcePage={currentPage}
        pageCount={pageCount} />
    </>
  )
}

export default memo(AppPaginationComponent)
