import { boot } from 'quasar/wrappers'
import { Notify } from 'quasar'

export default boot(({ app }) => {
  app.config.errorHandler = (err) => {
    const message = err instanceof Error ? err.message : '알수 없는 에러'
    Notify.create({
      icon: 'mdi-alert',
      message,
      timeout: 0,
      actions: [
        { label: '확인', color: 'white', handler: () => { /* ... */ } }
      ]
    })
  }
})
