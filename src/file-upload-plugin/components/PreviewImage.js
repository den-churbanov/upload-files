import React, {
    useEffect,
    useState
} from 'react'

export const PreviewImage = ({buffer, name, size, idx, upload, progress, link, deleteFile}) => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        //console.log('useEffect called')
        setImage({
            buffer,
            name,
            size,
            idx
        })
    }, [buffer, setImage])

    const preview = image &&
        <>
            {
                !upload &&
                <div className="preview-remove"
                     onClick={event => deleteFile(event, idx)}>&times;</div>
            }
            <img src={image.buffer} alt={image.name}/>
            <div className={`preview-info ${upload ? 'upload' : ''}`}>
                {upload ?
                    <div className="preview-info-progress" style={{width: progress + '%'}}>
                        <span>{progress + '%'}</span>
                    </div>
                    :
                    <>
                        <span>{image.name}</span>
                        <span>{image.size}</span>
                    </>
                }
            </div>
        </>

    //console.log('PreviewImage render')
    return (
        <div className="preview-image">
            {link ?
                <a className="preview-link" href={link} target="_blank">
                    {preview}
                </a>
                :
                preview
            }
        </div>
    );
}