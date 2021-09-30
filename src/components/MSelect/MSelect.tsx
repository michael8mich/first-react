import { Row, Select, Spin } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { SelectProps } from 'antd/es/select';
import debounce from 'lodash/debounce';
import { ISelectProps, MSelectValue } from './IMSelect';
import { axiosFn } from '../../axios/axios';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState<ValueType[]>([]);
  const fetchRef = React.useRef(0);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select<ValueType>
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

// Usage of DebounceSelect

// async function fetchList(username: string): Promise<MSelectValue[]> {
//   console.log('fetching user', username);

//   return fetch('https://randomuser.me/api/?results=5')
//     .then(response => response.json())
//     .then(body =>
//       body.results.map(
//         (user: { name: { first: string; last: string }; login: { username: string } }) => ({
//           label: `${user.name.first} ${user.name.last}`,
//           value: user.login.username,
//           code: ''
//         }),
//       ),
//     );
// }

const MSelect = (props:ISelectProps) => {
  const [value, setValue] = React.useState<MSelectValue[]>([]);
  async function fetchList(username: string): Promise<MSelectValue[]> {
    console.log('fetching user', username);
    
    const response = await  axiosFn("get", '', props.what, props.tname, props.where , ''  )  
    debugger
    let hasError = false;
    if(response.data["error"]) hasError = true;
      if(response.data&&!hasError)
      {
        return response.data
      }
      return []

    // return fetch('https://randomuser.me/api/?results=5')
    //   .then(response => response.json())
    //   .then(body =>
    //     body.results.map(
    //       (user: { name: { first: string; last: string }; login: { username: string } }) => ({
    //         label: `${user.name.first} ${user.name.last}`,
    //         value: user.login.username,
    //         code: ''
    //       }),
    //     ),
      // );
  }
  return (
    
    <div style={{display:'flex', padding: 7 }}>
      <div style={{flex: '50%' }} ><b>{props.label}</b></div>
     <DebounceSelect
      mode={props.mode}
      value={value}
      placeholder={props.placeholder}
      fetchOptions={fetchList}
      onChange={newValue => {
        setValue(newValue);
      }}
      style={props.style}
    />
    </div>
  );
};

export default MSelect;
