const fetchOptions = {
  method: 'POST',
  timeout: 10000,
  mode: 'cors',
  headers: { 'content-type': 'application/json'}
}

const buildUrl = (path, params) => {
  const url = new URL(path, 'http://127.0.0.1:3001')
  for (let key in params) {
    let value = params[key]
    if (key === 'number' || key === 'size') {
      key = 'page.' + key
    }
    url.searchParams.append(key, value)
  }
  console.log(url.toString())
  return url.toString()
}

export const list = (dir, pageInformation) => {
  console.log(dir)
  return fetch(buildUrl('/list', pageInformation), {
    ...fetchOptions,
    body: JSON.stringify({
      dir: dir
    })
  })
}

export const init = () => fetch(buildUrl('/init'), {
  ...fetchOptions,
  method: 'GET'
})