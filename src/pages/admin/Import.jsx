/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */
/* Notes:
   - usage: `ReactDOM.render( <SheetJSApp />, document.getElementById('app') );`
   - xlsx.full.min.js is loaded in the head of the HTML page
   - this script should be referenced with type="text/babel"
   - babel.js in-browser transpiler should be loaded before this script
*/
import { Col, Row, Button, Input } from "antd";
import React from "react";
import XLSX from "xlsx";
import i18n from "i18next";
import CloudUploadOutlined from '@ant-design/icons/lib/icons/CloudUploadOutlined';
import { axiosFn } from '../../axios/axios.js';
import { RouteNames } from '../../router';
import { CacheActionCreators } from '../../store/reducers/cache/action-creators';
import { useAction } from '../../hooks/useAction';

export default class Import extends React.Component {
  constructor(props) {
    debugger
    super(props);
    this.state = {
      data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
      cols: [] /* Array of column objects e.g. { name: "C", K: 2 } */
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }

  importList = () => {
    let data = [...this.state.data]
    let ids = []
    debugger
    data.map(async(r, i) => {
      if(i>0)
      {
        let hasError
        let user = {last_name: r[0],first_name: r[1], email:r[2], login:r[3], phone: r[4],mobile_phone: r[5], additional_phone: r[6]  }
        const responseNew = await axiosFn("post", user, '*', 'contact', "id" , ''  )  
        if(responseNew?.data["error"]) hasError = true;
        if(responseNew?.data&&!hasError)
        {
            let new_id = responseNew.data[0].id
            ids.push("'"+ new_id+ "'")
        }
        else {
          //window.alert(user)
          console.log(user, 'ERROR');
        }  
        console.log(user);
        if(data.length===i+1){
          let q = " ( id in ("+ ids.join() + ") ) "
          let queriesCache = { ["contact"]: q, ["contact_label"]: 'Exported Users' }
          CacheActionCreators.setQueriesCache(queriesCache)
          this.props.history.push(RouteNames.USERS  )
        }
      }
      
      })

  }
  handleFile(file /*:File*/) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      console.log(rABS, wb);
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      this.setState({ data: data, cols: make_cols(ws["!ref"]) });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }
  exportFile() {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(this.state.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  }
  render() {
    return (
      <DragDropFile handleFile={this.handleFile}>
        <Row>
          <Col>
            <DataInput handleFile={this.handleFile} />
          </Col>
        </Row>
        { this.state.data.length &&
          <Row>
          <Col>
            <Button
              type="primary" 
              htmlType="button" 
              disabled={!this.state.data.length}
              className="btn btn-success"
              onClick={this.exportFile}
            >
              {i18n.t('export')} 
            </Button>
            </Col>
            <Col>
            <Button
              type="primary" 
              htmlType="button" 
              disabled={!this.state.data.length}
              className="btn btn-success"
              onClick={this.importList}
            >
              {i18n.t('import')} 
            </Button>
            </Col>
        </Row>
        }
        
        <Row>
          <Col>
            <OutTable data={this.state.data} cols={this.state.cols} />
            </Col>
        </Row>
      </DragDropFile>
    );
  }
}

/* -------------------------------------------------------------------------- */

/*
  Simple HTML5 file drag-and-drop wrapper
  usage: <DragDropFile handleFile={handleFile}>...</DragDropFile>
    handleFile(file:File):void;
*/
class DragDropFile extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }
  suppress(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
  onDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    const files = evt.dataTransfer.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <div
        onDrop={this.onDrop}
        onDragEnter={this.suppress}
        onDragOver={this.suppress}
      >
        {this.props.children}
      </div>
    );
  }
}

/*
  Simple HTML5 file input wrapper
  usage: <DataInput handleFile={callback} />
    handleFile(file:File):void;
*/
class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const files = e.target.files;
    if (files && files[0]) this.props.handleFile(files[0]);
  }
  render() {
    return (
      <form className="form-inline">
        <div className="form-group" style={{border:'1px gray solid', padding:10}}>
       
          <label htmlFor="file">
          <CloudUploadOutlined style={{fontSize:28}} />
          <br/>
            {i18n.t('select_files_for_upload')} </label>
          <Input
             placeholder="small size" 
             prefix={<CloudUploadOutlined />}
            style={{display:'none'}}
            type="file"
            className="form-control"
            id="file"
            accept={SheetJSFT}
            onChange={this.handleChange}
          />
    

        </div>
      </form>
    );
  }
}

/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/
class OutTable extends React.Component {
  render() {
    const handleChange = (e,i_,ii_) => {
      console.log(e.target.value);
      let data = [...this.props.data]
      data.map((r, i) => (
          this.props.cols.map((c,ii) => {
            if( i===i_&& ii===ii_ )
            r[c.key] = e.target.value
          }) 
          ))
      this.setState({ data :data });
    }

    return (
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {this.props.cols.map(c => (
                <th key={c.key}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.data.map((r, i) => (
              <tr key={i}>
                {this.props.cols.map((c,ii) => (
                  <td key={c.key}>
                    <input 
                    disabled={i===0}
                    value= {r[c.key]}
                    onChange={(event) => handleChange(event,i,ii)}
                    />                     
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

/* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]
  .map(function(x) {
    return "." + x;
  })
  .join(",");

/* generate an array of column objects */
const make_cols = refstr => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (var i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
