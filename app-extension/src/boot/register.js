import { boot } from 'quasar/wrappers'
//import VuePlugin from 'quasar-ui-inline-edit-table'
import * as VuePlugin from 'quasar-ui-inline-edit-table/src/vue-plugin'

export default boot(({ app }) => {
  app.use(VuePlugin)
})
