import React, {FC} from 'react';
import { Layout } from 'antd';
const FooterComponent: FC = () => {
    return (
      <Layout.Footer style={{height:'10px'}}>
      <div style={{fontSize:'8px'}}>
      UTA System(Users Tickets Assets) v(1.0.0) Michael Khokhlinov Co 2021
      </div>
    </Layout.Footer>
    )
  }
  export default FooterComponent;