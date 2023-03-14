import {memo} from "react";
import {Editor, RichUtils} from 'draft-js';
import '../../assets/app/css/rich-text.css';
import {Button} from "react-bootstrap";

const AppRichText = ({ state, onChange }) => {
  function handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) onChange(newState)
  }

  function _onKeyClick(keyBinding) {
    onChange(RichUtils.toggleInlineStyle(state, keyBinding))
  }

  function _blockStyleFn(contentBlock) {
    const type = contentBlock.getType()
    if (type === 'blockquote') return 'superFancyBlockquote'
  }

  return (
    <div style={{ borderLeft: '1px solid lightgray', borderRight: '1px solid lightgray', borderBottom: '1px solid lightgray' }}>
      <div
        style={{ fontSize: '0.8rem', borderBottom: '1px solid lightgray', borderTop: '1px solid lightgray'}}
        className='p-1'>
        <Button
          type='button'
          variant='light'
          size='sm'
          className='fw-bold border-1 border-dark'
          onClick={() => _onKeyClick('BOLD')}>
          G
        </Button>
      </div>
      <div className='p-2'>
        <Editor
          editorState={state}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={_blockStyleFn}
          onChange={onChange} />
      </div>
    </div>
  )
}

export default memo(AppRichText)
