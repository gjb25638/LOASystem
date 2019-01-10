import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Detail from '@/components/Detail'
import RecordList from '@/components/RecordList'
import MonthlyReport from '@/components/Report/Monthly'
import AnnualReport from '@/components/Report/Annual'
import CompensatoryReport from '@/components/Report/CompensatoryReport'
import Login from '@/views/Login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/employees',
      name: 'List',
      component: List
    },
    {
      path: '/employee/:id',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/employee/:id/records',
      name: 'RecordList',
      component: RecordList
    },
    {
      path: '/report/:year/',
      name: 'AnnualReport',
      component: AnnualReport
    },
    {
      path: '/report/:year/:month',
      name: 'MonthlyReport',
      component: MonthlyReport
    },
    {
      path: '/compensatoryReport',
      name: 'CompensatoryReport',
      component: CompensatoryReport
    }
  ]
})
