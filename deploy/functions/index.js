const admin = require('firebase-admin')
const functions = require('firebase-functions')

exports.removeLoggedInfo = functions.https.onRequest(async (req, res) => {
  admin.initializeApp()

  try {
    const { id, env, front } = req.query

    if (!id || !env || !front) throw new Error('Informe o id, env e front')

    const ref = admin.database().ref(`liveusers/${env}/${front}/${id}`)
    const snap = await ref.once('value')

    if (!snap.val()) throw new Error('Não há dados para os parâmetros informados')

    ref.remove()
    res.statusCode = 200
    res.send({ message: 'Removido com sucesso!' })
  } catch (error) {
    res.statusCode = 500
    res.send({ error: error.toString() })
  }
})

exports.deleteOldLiveusers = functions.database.ref('/{any}').onCreate(s => s.ref.remove())
