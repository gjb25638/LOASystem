import axios from 'axios'
import config from '@/services/config'

export default () => {
  return axios.create({
    baseURL: config.API_URL
  })
}
