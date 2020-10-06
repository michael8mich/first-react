import * as axios from 'axios'
const SERVER_PATH = 'http://mx:8082/'
const instance = axios.create({
    baseURL: SERVER_PATH + 'q/qh', //'http://mx/WebJ/GetJ'
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
    }
})
const uploadInstance = axios.create({
    baseURL: 'http://mx:8082/upload',
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/'
    }
})
export const restApi = {
    getList(currentPage, pageSize, type, first, second, third, order) {
        return instance({
            method: type,
            params: {},
            headers: {
                'first': first,
                'second': second,
                'third': ' ' + third + '  order by ' + order + ' offset ' + pageSize + ' * ' + (currentPage - 1) + ' rows fetch next ' + pageSize + ' rows ONLY OPTION (RECOMPILE) '
            }
        })
            .then((result) => {
                return result.data;
            })
    },
    globalApi(type, first, second, third) {
        return instance({
            method: type,
            params: {},
            headers: {
                'first': first,
                'second': second,
                'third': third
            }
        })
            .then((result) => {
                return result.data;
            })
            .catch(
                function (error) {
                    console.log('Show error notification!')
                    return Promise.reject(error)
                })

    },
    savePhoto(type, file) {

        const data = new FormData()
        data.append('file', file)
        return axios.post(SERVER_PATH + 'upload', data, {
            // receive two    parameter endpoint url ,form data
        }).then(res => {
            return res.data;
        }).catch(
            function (error) {
                console.log('Show error notification!')
                console.log(error)
                return Promise.reject(error)
            })
    }
}



