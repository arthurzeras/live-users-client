const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp()

function formatDate (date) {
  if (typeof date !== 'string') return date

  date = date.split(' ')
  day = date[0].split('/')
  hour = date[1].split(':')

  return new Date(day[2], Number(day[1]) - 1, day[0], hour[0], hour[1], hour[2]).getTime()
}

exports.removeLoggedInfo = functions.database.ref('/liveusers/prod/{front}/{userId}')
  .onWrite((change, context) => {
    if (!change.after.exists()) return null

    setTimeout(async () => {
      const { userId, front } = context.params
      const { createdAt } = change.after.val()

      const snap = await admin.database()
        .ref(`/liveusers/prod/${front}/${userId}`).once('value')

      if (snap.val()) {
        const { createdAt: currentCreatedAt } = snap.val()

        if (formatDate(createdAt) - formatDate(currentCreatedAt) === 0) {
          change.after.ref.remove()
        }
      }
    }, 25000)

    return Promise.resolve()
  })

exports.deleteOldLiveusers = functions.database.ref('/{any}')
  .onCreate((snapshot, context) => !context.params.any.includes('liveusers')
    ? snapshot.ref.remove()
    : Promise.resolve()
  )
