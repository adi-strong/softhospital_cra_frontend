import {Card} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {entrypoint} from "../../app/store";

export function SingleContract({isLoading, isSuccess, covenant,}) {
  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <h2><i className='bi bi-filetype-pdf me-3'/> Contrat</h2> <hr className='mt-0'/>
          {isLoading && <BarLoaderSpinner loading={isLoading}/>}
          {isSuccess && covenant &&
            <>
              {covenant?.filePath
                ?
                <a href={entrypoint+'/media/pdf/'+covenant.filePath} target='_blank' rel='noreferrer'>
                  <i className='bi bi-file-pdf-fill'/> {covenant.filePath}
                </a>
                : '❓'}
            </>}
        </Card.Body>
      </Card>
    </>
  )
}
