import Component from './components/Component'


import pkg from '../package.json'
const { version } = pkg

function install (app) {
  app.component(Component.name, Component)

}

export {
  version,
  Component,

  install
}
