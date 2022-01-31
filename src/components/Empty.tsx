
import  {FC, useEffect} from 'react';
import { useHistory } from 'react-router';
import { useTypedSelector } from '../hooks/useTypedSelector';


const Empty:FC = () => {
  const router = useHistory()
  const {pathForEmpty } = useTypedSelector(state => state.cache)
  useEffect(() => {
    router.push(pathForEmpty)
  }, [])
  return (
   <div>
   </div>
  )
}
  export default Empty