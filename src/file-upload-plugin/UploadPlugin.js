import React, {
    useRef,
    useState
} from 'react'
import './upload-plugin.css'
import {PreviewImage} from "./components/PreviewImage";

export const UploadPlugin = ({accept = ['.png', '.jpg', 'jpeg', '.gif']}) => {
    const [state, setState] = useState({
        files: []
    })

    const input = useRef(null)

    const openBtnHandler = event => {
        event.preventDefault()
        event.persist()
        setState(prevState => {
            return {
                ...prevState,
                files: []
            }
        })
        input.current.click()
    }

    const inputOnChangeHandler = async event => {
        event.preventDefault()
        event.persist()
        if (!event.target.files.length) return
        const files = Array.from(event.target.files)
        setState(prevState => {
            return {
                ...prevState,
                files
            }
        })
    }

    const deleteFile = (event, id) => {
        const preview = event.target.parentElement
        preview.classList.add('delete-animation')
        const newFiles = state.files.filter((file, idx) => idx !== id)
        setTimeout(() => {
            preview.classList.remove('delete-animation');
            setState(prevState => {
                    return {
                        ...prevState,
                        files: newFiles
                    }
                }
            )
        }, 300);

    }

    const uploadFiles = () => {

    }

    console.log('UploadPlugin render')
    return (
        <div className="upload_plugin_container">
            <div className="card">
                <input type="file"
                       multiple={true}
                       accept={Array.isArray(accept) ? accept.join(',') : ''}
                       ref={input}
                       onChange={inputOnChangeHandler}/>
                <button className="btn"
                        onClick={openBtnHandler}>Открыть
                </button>
                {state.files.length ?
                    <>
                        <button className="btn primary" onClick={uploadFiles}>Загрузить</button>
                        <div className="preview">
                            {state.files.map((file, idx) =>
                                <PreviewImage file={file}
                                              idx={idx}
                                              key={idx}
                                              deleteFile={deleteFile}
                                />
                            )}
                        </div>
                    </>
                    : ''}
            </div>
        </div>
    )
}