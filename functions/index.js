const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
exports.like = functions.https.onCall(async (data, context) => {
	console.log(data.text)
	console.log(context.auth.uid)
})
