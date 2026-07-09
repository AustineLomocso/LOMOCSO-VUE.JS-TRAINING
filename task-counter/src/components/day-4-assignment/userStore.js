import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {

  const currentUser = ref('')
  const isLoggedIn  = computed(() => currentUser.value !== '')

  function login(name) {
    if (name === '') return
    currentUser.value = name
  }

  function logout() {
    currentUser.value = ''
  }

  return { currentUser, isLoggedIn, login, logout }

}, {
  persist: true,
})
