import Api from '@/services/Api'

export default {
  getAnnualReport(params) {
    const url = `annualreport/${params.year}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().get(url)
  },
  getMonthlyReport(params) {
    const url = `monthlyreport/${params.year}/${params.month}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().get(url)
  },
  auth(params) {
    return Api().post('auth', params);
  },
  fetch(params) {
    const url = `employees/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().get(url)
  },
  fetchForLightweight(params) {
    const url = `employees/lightweight/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().get(url)
  },
  add(params) {
    const url = `employee/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().post(url, params)
  },
  update(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url, params)
  },
  updateLOA(params) {
    const url = `employee/loa/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url, params)
  },
  updatePWD(params) {
    const url = `employee/pwd/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url, params)
  },
  updateEmail(params) {
    const url = `employee/email/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url, params)
  },
  updateSign(params) {
    const url = `employee/sign/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url, params)
  },
  get(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().get(url)
  },
  delete(params) {
    const url = `employee/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().delete(url)
  },
  switch(params) {
    const url = `switch/${params.id}/${params.loginuser}/${encodeURIComponent(params.token)}`
    return Api().put(url)
  }
}
