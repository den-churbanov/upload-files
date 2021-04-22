import React, {
    useCallback,
    useEffect,
    useState
} from 'react'

export const PreviewImage = ({file, idx, deleteFile}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        readFile(file).then(
            (result) => {
                setImage({
                    buffer: result,
                    fileName: file.name,
                    fileSize: bytesToSize(file.size),
                    idx
                })
            }
        )
    }, [])

    const readFile = useCallback(file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                resolve(ev.target.result)
            }
            reader.onerror = reject;
            reader.readAsDataURL(file)
        }), [])

    const bytesToSize = function (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
        if (!bytes) return '0 Byte'
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
    }

    if (!file.type.match('image')) return

    console.log('PreviewImage render')
    return (
        image ?
            <div className="preview-image">
                <div className="preview-remove" onClick={event => deleteFile(event, idx)}>&times;</div>
                {<img
                    src={image.buffer}
                    alt={image.fileName}/>}
                <div className="preview-info">
                    <span>{image.fileName}</span>
                    <span>{image.fileSize}</span>
                </div>
            </div> :
            <span>
                Загрузка...
            </span>
    );
}