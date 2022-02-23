import { Upload, Button, Space, Tooltip, Modal } from 'antd';
import { UploadOutlined, PictureOutlined, SyncOutlined, DownloadOutlined,ImportOutlined } from '@ant-design/icons';
import React,  {FC, forwardRef, Ref, useEffect, useImperativeHandle, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { RcFile } from 'antd/lib/upload';
import { axiosFn, axiosFnUpload, Base_URL, TOKEN } from '../../axios/axios';
import moment from 'moment';
import CloudUploadOutlined from '@ant-design/icons/lib/icons/CloudUploadOutlined';
import { IAttachment } from '../../models/IObject';
import { anyTypeAnnotation } from '@babel/types';
import { useAction } from '../../hooks/useAction';
import { factory } from 'typescript';
import { getFileMimeType } from '../../utils/validators';
interface UploadFProps {
  id:string,
  factory:string,
  setOpenPrScreen: (event: boolean) => void,
}
interface File {
  url: any
  preview: any
  originFileObj: any
}
const UploadFiles = forwardRef((props:UploadFProps, ref) => {
  const { t } = useTranslation();      
  const { user } = useTypedSelector(state => state.auth)
  const {error, isLoading  } = useTypedSelector(state => state.admin)
  const [antPics, setAntPics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([] as any[]);
  const [toSaveFileList, setToSaveFileList] = useState([] as any[]);
  const {createTicketActivity, setAlert} = useAction()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [selectedFile, setSelectedFile] = useState({} as any)
  const [selectedUrl, setSelectedUrl] = useState('')
  const [selectedName, setSelectedName] = useState('')
  

  useImperativeHandle(
    ref, () => ({
      
      upload_files(id:string) {
        uploadFilesToServer()
      },
      get_files() {
        getAttachments()
      }
    }))

  interface RcFileMich {
        uid: string,
        name: string,
        status: "error" | "done" | "success" | "uploading" ,  
        url: string,
        thumbUrl: string,
        lastModifiedDate?: Date
  }

  useEffect(() => {
    if(props.id!=='0')
    getAttachments()
  }, [props.id])

   
  const getAttachments = async () => { 
      setLoading(false)
      let resArray:any[] = []
      try {
        const result = await axiosFn('get', '', '*', 'attachment', " object = '"+ props.id +"' AND factory = '"+props.factory+"'")
        result.data.map((r: { id: any; name: any; file_name: string; create_date: number; }) => {
          let at = {
            uid: r.id,
            name: r.name,
            status: 'done', //error
            url: PATH_TO_FOLDER + r.file_name ,
            thumbUrl: PATH_TO_FOLDER + r.file_name ,
            lastModifiedDate: moment.unix(r.create_date)
          }
          resArray.push(at)
         })
         setFileList([...resArray])
      } catch (e){}
  }  
  
  const FILE_COUNT=10
  const PATH_TO_FOLDER =  Base_URL + '/download/'
  //const PATH_TO_FOLDER =  'http://mx/f/'

  const handleUpload =  async (info: any) => {
    
    
    if(info.file.status === "removed") 
    {
      let confirm = window.confirm(t('are_you_sure')) ? true : false
      if(!confirm) {
        return
      }
      let res = await axiosFn('delete', '', '', 'attachment', 'id', info.file.uid)
      if(props.factory === 'ticket') {
        let value = {new_value: info.file.name + ' ' + t('file_was_removed')} as any
        let values = {...value, name: t('file_was_removed'), ticket: props.id, old_value: '' }
        createTicketActivity(values, user.id)
      }
    }
   
    let file_file_list_new:any = []
    let file_file_list:any = []
    let fileList_ = [...info.fileList];
    fileList_ = fileList_.slice(-FILE_COUNT);
    fileList_.forEach(function(file, index) {
      if(file.originFileObj)
      file_file_list.push(file.originFileObj)
      file_file_list_new.push(file)
      // let reader = new FileReader();
      // reader.onload = (e:any) => {
      //    file.base64 =  e.target.result;
      // };
      // reader.readAsDataURL(info.file.originFileObj);
    });
    setFileList(file_file_list_new);
    setToSaveFileList(file_file_list)
  }
  const uploadFilesToServer = async () => {
  toSaveFileList.length === 0 ? setLoading(false) : setLoading(true)
  let index = 1;
  await toSaveFileList.map(async f =>{
  let hasError = false;
  const  response:any = await axiosFnUpload(f, props.id)
  if(response.data["error"]&&!response.data["fileName"]) hasError = true;
   if(!hasError)
   {
     let att = {
      name:f.name,
      file_name: response.data.fileName,
      factory: props.factory,
      object: props.id,
      last_mod_by: user.id
     } as IAttachment
    const  response_att = await axiosFn('post', att, '', 'attachment', 'id')
    if(props.factory === 'ticket') {
      let value = {new_value: f.name + ' ' + t('file_was_added')} as any
      let values = {...value, name: t('file_was_added'), ticket: props.id, old_value: '' }
      createTicketActivity(values, user.id)
    }
    if(toSaveFileList.length===index)
    getAttachments()
    index++
    f.status = 'done'
   }
})
    let fileList_done  =   fileList.map(f=> {
            return {...f, status:'success'}
           })
           setToSaveFileList([])
           setFileList([...fileList_done])
  }
  const prp = {
    headers: {
      Authorization: `Bearer ${TOKEN.token}`,
    },
    action: PATH_TO_FOLDER,
    name: 'file',
  };
  const handleCancel = () => {setPreviewVisible(false)};
  const getImageOrFallback = (path:string) => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = path;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };
  const downloadByLink = (src:string) => {
    const link = document.createElement('a')
            link.href = src
            link.download = selectedName;
            link.click()
  }
  const file2Base64 = (file:any):Promise<string> => {
    return new Promise<string> ((resolve,reject)=> {
         const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = () => resolve(reader.result?.toString() || '');
         reader.onerror = error => reject(error);
     })
    }
  const openInNewWindowByLink = async (src:string) => {
    getImageOrFallback(src).then(async correctImg => {
      if(correctImg) { 
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    if(imgWindow)
    imgWindow.document.write(image.outerHTML);
      } else {
        var w = window.open('about:blank');
        const response = await fetch(src);
        const data = await response.blob();
        if( getFileMimeType(data.type) === 'Error') 
        return
        const b64 = await file2Base64(data)
        setTimeout(function(){
          if(w) {
            w.document.body.style.width = '100%'
            w.document.body.style.height = '100%'
            let iframe = w.document.createElement('iframe')
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            w.document.body.appendChild(iframe)
                .src = b64.toString()
          }     
        }, 0);
      }
    })
}
  
  const handlePreview = async (file: any) => {
    setSelectedFile(file)
    if (file.url) {
      let src = file.url;
      if (src) {
        setSelectedUrl(src)
        setSelectedName(file.name)
        getImageOrFallback(src).then(async correctImg => {
          if(correctImg) {
            setPreviewImage(src)
            setPreviewVisible(true)
          } else {
            const response = await fetch(src);
            const data = await response.blob();
            if( getFileMimeType(data.type) === 'Error') 
            downloadByLink(src)
            else
            {
                setPreviewImage('')
                setPreviewVisible(true)
            }
            }
        }) 
      }
      else {
        
      }
    }
  }
    return (
      <>
    <Space direction="vertical" style={{ width: '100%' }} size="small">
    <Tooltip title={t('_printScreen')} >
      <Button 
      onClick={() => props.setOpenPrScreen(true) }
      >
      <PictureOutlined 
          style={{color:'gray',fontSize:'18px'}}
          
         />{t('makePrintScreen')}
         </Button>
          </Tooltip>
      <Upload
           {...prp}
          listType="picture-card"
          // listType="picture"
          maxCount={FILE_COUNT}
          multiple={true}
          // className="upload-list-inline"
          onPreview={handlePreview}
          onChange={handleUpload}
          fileList={fileList}
        >
        <UploadOutlined
        title= {t('select_files_for_upload')}
        style={{border:'1px dashed gray', fontSize:'33px', color:'gray'}}/>
         
              
         {
           loading &&
           <>
           <SyncOutlined spin style={{fontSize:'33px',color:'gray',padding:'10px'}} />&nbsp;&nbsp;
           </>
         } 
        </Upload>
        {
          toSaveFileList.length>0 && props.id !== '0' &&
          <Button type="ghost" icon={<CloudUploadOutlined />}
          onClick={()=>uploadFilesToServer()}
          >{t('upload_files')}</Button>  
        }
        {
           toSaveFileList.length>0 && props.id === '0' &&
           <h2  style={{color:'#FAAD14'}}>{t('upload_files_on_new')}</h2>
        }
  </Space>
  <Modal
          visible={previewVisible}
          title={selectedName}
          footer={null}
          onCancel={handleCancel}
          bodyStyle={{width:'100%',height:'100%'}}
        >
          <Tooltip title={t('download_file')} key="download">
          <DownloadOutlined style={{fontSize:33, color:'gray'}}  onClick={()=>downloadByLink(selectedUrl)}/>&nbsp;&nbsp;
          </Tooltip>
          
          <Tooltip title={t('open_file_in_new_window')} key="new_window">
          <ImportOutlined style={{fontSize:33, color:'gray'}}  onClick={()=>openInNewWindowByLink(selectedUrl)}/>
          </Tooltip>
          <br />
          {
            previewImage && 
            <img alt="example" style={{ width: '100%' }} src={previewImage} key="previewImage"/>
          }
          
        </Modal>
  </>
    )
  })
  
  
  export default UploadFiles;