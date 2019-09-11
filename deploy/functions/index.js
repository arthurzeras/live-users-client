const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp()

exports.removeLoggedInfo = functions.https.onRequest(async (req, res) => {
  try {
    const { id, env, front } = req.query

    if (!id || !env || !front) throw new Error('Informe o id, env e front')

    const ref = admin.database().ref(`id-${id}-${front}-${env}`)
    const snap = await ref.once('value')

    if (!snap.val()) throw new Error('Não há dados para os parâmetros informados')

    ref.remove()
    res.send({ message: 'Removido com sucesso!' })
  } catch (error) {
    res.send({ error: error.toString() })
  }
})
