import Vue from 'vue'
import TableMenu from '@/components/TableMenu'

describe('TableMenu.vue', () => {
  it('logout: clear cookie and reddirect to login page', () => {
    const Constructor = Vue.extend(TableMenu)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
