let timeout = null
const debounce = (cb, wait = 5000) => {
  if (timeout !== null) clearTimeout(timeout)
  timeout = setTimeout(() => {
    timeout = null
    cb && cb()
  }, wait);
}
module.exports = debounce;