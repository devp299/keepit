import { Models } from 'node-appwrite';
import React from 'react'
import Thumbnail from './Thumbnail';
import FormattedDateTime from './FormattedDateTime';

const ImageThumbnail = ({ file }: {file: Models.Document }) => {
    <div className='file-details-thumbnail'>
        <Thumbnail type={file.type} extension={file.extension} url={file.url}  />
        <div className='flex-col flex'>
            <p className='subtitle-2 mb-1'>{file.name}</p>
            <FormattedDateTime date={file.$createdAt} className='caption' />
        </div>
    </div>
}

const Detailrow = ({ label, value }: { label: string; value: string; }) => (
    <div className='flex'>
        <p className='file-details-label'>{label}</p>
        <p className='file-details-value'>{value}</p>
    </div>
)
export const FileDetails = ({ file }: {file: Models.Document}) => {
  return (
    <>
        <ImageThumbnail file={file} />   
    </>
  )
};

