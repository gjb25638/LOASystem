import axios from 'axios'
import VueCookie from 'vue-cookie';

export default () => {
  const apiUrlFromCookie = VueCookie.get("api_url")
  return axios.create({
    baseURL: process.env.API_URL || (apiUrlFromCookie ? `http://${apiUrlFromCookie}/` : '')
  })
}
