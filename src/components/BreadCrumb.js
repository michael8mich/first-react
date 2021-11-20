import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import i18n from "i18next";
const BreadCrumb = () => {
  const location = useLocation();
  const breadCrumbView = () => {
    const { pathname } = location;
    const pathnames = pathname.split("/").filter((item) => item);
    const capatilize = (s) => {
        if(s.length>=32) s = 'detail'
       return    i18n.t(s) 
    }//s.charAt(0).toUpperCase() + s.slice(1);
    return (
      <div>
        <Breadcrumb key="Breadcrumb">
          {pathnames.length > 0 ? (
            <Breadcrumb.Item 
            key="home">
              <Link to="/">{i18n.t('home')}</Link>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
            key="home_home"
            >{i18n.t('home')}</Breadcrumb.Item>
          )}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            return isLast ? (
              <Breadcrumb.Item key={index+'_'+name+'__'+index + routeTo }>{capatilize(name)}</Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item >
                <Link to={`${routeTo}`} key={index+name+'_'+index + routeTo} >{capatilize(name)}</Link>
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
    );
  };

  return <>{breadCrumbView()}</>;
};

export default BreadCrumb;