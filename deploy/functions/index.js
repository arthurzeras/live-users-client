const moment = require('moment')
const admin = require('firebase-admin')
const countBy = require('lodash.countby')
const orderBy = require('lodash.orderby')
const functions = require('firebase-functions')

const cors = require('cors')({ origin: true })

admin.initializeApp({ databaseURL: 'https://kintegra-navegacoes.firebaseio.com' })

const filterPeriod = ({ createdAt }, filter) => {
  const itemDate = moment(createdAt)

  return new Map([
    ['H', itemDate.isSame(moment(), 'day')],
    ['O', itemDate.isSame(moment().subtract(1, 'd'), 'day')],
    ['S', itemDate.isSame(moment(), 'week')],
    ['M', itemDate.isSame(moment(), 'month')]
  ]).get(filter)
}

const filterTop10 = data => {
  const ignored = ['/logout', '/painel/contador', '/.']
  const counts = countBy(data, i => i.pagina)

  data = Object.keys(counts)
    .filter(i => !ignored.includes(i))
    .map(i => ({ page: i, total: counts[i] }))

  return orderBy(data, i => i.total, 'desc').splice(0, 10)
}

exports.findNavigations = functions.https.onCall(async data => {
  try {
    const snapshot = await admin.database().ref('/').once('value')
    const items = snapshot.val()

    const values = Object.keys(items)
      .map(item => items[item])
      .filter(item => item.env === 'prod')
      .filter(item => filterPeriod(item, data.filter))
      .map(({ tipo, pagina }) => ({ tipo, pagina }))

    return {
      cliente: filterTop10(values.filter(item => item.tipo === 'cliente')),
      contador: filterTop10(values.filter(item => item.tipo === 'contabilidade'))
    }
  } catch (error) {
    return { error: error.toString() }
  }
})
