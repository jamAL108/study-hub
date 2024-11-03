import './styles.scss'
import React from 'react'

const MenuBar = ({ editor }:any) => {
    if (!editor) {
      return null
    }

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <button onClick={addImage}>Add image from URL</button>
        </div>
      </div>
    </>
  )
}

export default MenuBar