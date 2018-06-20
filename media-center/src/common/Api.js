const baseUrl = 'http://127.0.0.1:3001'
const fetchOptions = {
  method: 'POST',
  timeout: 10000,
  mode: 'cors',
  headers: { 'content-type': 'application/json'}
}
export const list = (dir) => fetch(baseUrl + '/list', {
  ...fetchOptions,
  body: JSON.stringify({
    dir: dir
  })
})

export const init = () => fetch(baseUrl + '/init', {
  ...fetchOptions,
  method: 'GET'
})