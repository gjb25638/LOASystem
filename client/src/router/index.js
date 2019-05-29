import Vue from 'vue'
import Router from 'vue-router'
import List from '@/views/List'
import Detail from '@/views/Detail'
import RecordList from '@/views/RecordList'
import MonthlyReport from '@/views/Report/MonthlyReport'
import AnnualReport from '@/views/Report/AnnualReport'
import CompensatoryList from '@/views/CompensatoryList'
import Login from '@/views/Login'
import LeaveTypeInfo from '@/views/LeaveTypeInfo'
import LeaveCalendar from '@/views/LeaveCalendar'
import ShiftCalendar from '@/views/ShiftCalendar'

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
      path: '/employee/:id/records/:query?',
      name: 'RecordList',
      component: RecordList
    },
    {
      path: '/report/annual',
      name: 'AnnualReport',
      component: AnnualReport
    },
    {
      path: '/report/monthly',
      name: 'MonthlyReport',
      component: MonthlyReport
    },
    {
      path: '/compensatorylist',
      name: 'CompensatoryList',
      component: CompensatoryList
    },
    {
      path: '/leavetype',
      name: 'LeaveTypeInfo',
      component: LeaveTypeInfo
    },
    {
      path: '/calendar/leave',
      name: 'LeaveCalendar',
      component: LeaveCalendar
    },
    {
      path: '/calendar/shift',
      name: 'ShiftCalendar',
      component: ShiftCalendar
    }
  ]
})
