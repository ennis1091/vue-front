
export const clearHttpRequestingList = () => {
  if (window.__axiosPromiseArr.length > 0) {
    console.log(window.__axiosPromiseArr)
    window.__axiosPromiseArr.forEach((item) => {
      item()
    })
    window.__axiosPromiseArr = []
  }
}