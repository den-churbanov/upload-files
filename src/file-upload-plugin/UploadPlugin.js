import React, {
    useEffect,
    useRef,
    useState
} from 'react'
import './upload-plugin.css'
import {PreviewImage} from "./components/PreviewImage";

export const UploadPlugin = ({accept = ['.png', '.jpg', 'jpeg', '.gif'], onUpload}) => {
    const [files, setFiles] = useState([])
    const [previews, setPreviews] = useState([])
    const [loading, setLoading] = useState({
        state: false,
        count: 0
    });
    const [links, setLinks] = useState([])
    const [upload, setUpload] = useState(false)
    const [uploadProgress, setUploadProgress] = useState([])
    const [dragEnter, setDragEnter] = useState(false)
    const input = useRef(null)
    const uploadBtn = useRef(null)
    const openBtn = useRef(null)

    useEffect(() => {
        //console.log('useEffect worked')
        let x = 0
        uploadProgress.map(i => x += i)
        if (x === files.length * 100) {
            openBtn.current.disabled = false
        }
        else {
            if (!openBtn.current.disabled)
                openBtn.current.disabled = true
        }
    }, [uploadProgress])

    const openBtnHandler = event => {
        event.preventDefault()
        setFiles([])
        setPreviews([])
        setUpload(false)
        setUploadProgress(new Array(files.length).fill(0))
        setLinks(new Array(files.length).fill(''))
        if (uploadBtn.current) uploadBtn.current.disabled = false
        input.current.click()
    }

    const inputOnChangeHandler = event => {
        event.preventDefault()
        if (!event.target.files.length) return
        setFiles(Array.from(event.target.files))
        readAllFiles(event.target.files)
    }

    const readFile = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                resolve({
                    file,
                    buffer: ev.target.result
                })
            }
            reader.onerror = reject;
            reader.readAsDataURL(file)
        })

    const readAllFiles = function (files) {
        if (files instanceof Object)
            files = Array.from(files)
        setLoading({
            state: true,
            count: files.length
        });
        let promises = [];
        files.forEach(file => {
            if (!file.type.match('image')) return
            promises.push(readFile(file))
        })
        let images = [];
        Promise.all(promises).then(readers => {
            readers.forEach((reader, idx) => {
                images.push({
                    buffer: reader.buffer,
                    name: reader.file.name,
                    size: bytesToSize(reader.file.size),
                    idx
                });
            })
            setPreviews(images)
            setLoading({
                state: false,
                count: 0
            });
        })
    }

    const bytesToSize = function (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (!bytes) return '0 Byte'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
    }

    const deleteFile = (event, id) => {
        const preview = event.target.parentElement
        preview.classList.add('delete-animation')
        const newPreviews = previews.filter((file, idx) => idx !== id)
        const newFiles = files.filter((file, idx) => idx !== id)
        setTimeout(() => {
            preview.classList.remove('delete-animation');
            setFiles(newFiles)
            setPreviews(newPreviews)
        }, 300);
    }

    const dragEnterHandler = event => {
        event.preventDefault()
        setDragEnter(true)
    }

    const dragLeaveHandler = event => {
        event.preventDefault()
        setDragEnter(false)
    }

    const dropHandler = event => {
        event.preventDefault()
        readAllFiles(event.dataTransfer.files)
        setDragEnter(false)
    }

    const uploadFiles = () => {
        //call function to upload files
        onUpload(files, showUploadProgress, setLink);

        setUpload(true)
        uploadBtn.current.disabled = true
    }

    const setLink = function (idx, link) {
        setLinks(prevState => {
            let newState = prevState.slice()
            newState[idx] = link
            return newState;
        })
    }

    const showUploadProgress = (idx, progress) => {
        setUploadProgress(prevState => {
            let newState = prevState.slice()
            newState[idx] = progress
            return newState;
        })
    }

    //console.log('UploadPlugin render')
    return (
        <div className="upload_plugin_container">
            <div className="card">
                {
                    dragEnter ?
                        <div className="drop-area"
                             onDragEnter={dragEnterHandler}
                             onDragLeave={dragLeaveHandler}
                             onDragOver={dragEnterHandler}
                             onDrop={dropHandler}>
                            Перетащите файлы сюда
                        </div>
                        :
                        <div className="card-wrapper"
                             onDragEnter={dragEnterHandler}
                             onDragLeave={dragLeaveHandler}
                             onDragOver={dragEnterHandler}>
                            <input type="file"
                                   multiple={true}
                                   accept={Array.isArray(accept) ? accept.join(',') : ''}
                                   ref={input}
                                   onChange={inputOnChangeHandler}/>
                            <button className="btn"
                                    onClick={openBtnHandler}
                                    ref={openBtn}>Открыть
                            </button>
                            {previews.length ?
                                <>
                                    <button className="btn primary"
                                            onClick={uploadFiles}
                                            ref={uploadBtn}>
                                        Загрузить
                                    </button>
                                    <div className="preview">
                                        {previews.map((file, idx) =>
                                            <PreviewImage buffer={file.buffer}
                                                          name={file.name}
                                                          size={file.size}
                                                          upload={upload}
                                                          progress={uploadProgress[idx]}
                                                          link={links[idx]}
                                                          idx={idx}
                                                          key={idx}
                                                          deleteFile={deleteFile}
                                            />
                                        )}
                                    </div>
                                </>
                                :
                                loading.state ?
                                    <span className="loading">
                                        {`Файл${loading.count > 1 ? 'ы загружаются' : ' загружается'}...`}
                                    </span> :
                                    null
                            }
                        </div>
                }
            </div>
        </div>
    )
}