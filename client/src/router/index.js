import Vue from 'vue'
import Router from 'vue-router'
import List from '@/views/List'
import Detail from '@/views/Detail'
import RecordList from '@/views/RecordList'
import MonthlyReport from '@/views/Report/Monthly'
import AnnualReport from '@/views/Report/Annual'
import CompensatoryReport from '@/views/Report/CompensatoryReport'
import TableMenu from '@/components/TableMenu'
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
    },
    {
      path: '/test',
      name: 'TableMenu',
      component: TableMenu
    }
  ]
})
