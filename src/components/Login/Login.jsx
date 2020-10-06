import React from 'react';
import { reduxForm, Field } from 'redux-form'
import { createField, Input } from '../common/FormsControls/FormsControls'
import s from '../common/FormsControls/FormsControls.module.css'
import { required, maxLengthCreator } from '../../utils/validators/validators'
import { Redirect } from 'react-router-dom';

const LoginForm = (props) => {

  return <form onSubmit={props.handleSubmit}>
    <div>
      <Field component={Input} placeholder={"Login"} name={"login"} validate={[required]} />
    </div>
    <div>
      <Field component={Input} placeholder={"Password"} name={"password"} validate={[required]} />
    </div>
    <div>
      <Field component={"input"} type={"checkbox"} name={"rememberMe"} /> remember me
       </div>

    {props.error && <div className={s.formSummaryError}>{props.error}</div>}
    <div>
      <button >Login</button>
    </div>
  </form>

}

const LoginReduxForm = reduxForm({
  form: 'login'
})(LoginForm)
const Login = (props) => {
  const onSubmit = (formData) => {
    props.login(formData.login, formData.password, formData.rememberMe)
    console.log(formData);
  }
  if (props.isAuth) {
    return <Redirect to={"/profile"} />
  }
  else {
    return (<div>
      <h1>Login</h1>
      <LoginReduxForm onSubmit={onSubmit} />
    </div>)
  }

}
export default Login