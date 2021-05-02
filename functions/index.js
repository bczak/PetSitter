const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.like = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new Error('Unauthorized')
	}
	if (!data) {
		throw new Error('Pet ID is required')
	}
	if (!data.petId) {
		throw new Error('Pet ID is required')
	}
	let pet = await admin.firestore()
		.collection('pets')
		.doc(data.petId)
		.get()
	if (!pet.exists) {
		throw new Error('Pet does not exist')
	}
	let ref = admin.firestore()
		.collection('pets')
		.doc(data.petId)
		.collection('likes')
		.doc(context.auth.uid)
	let like = await ref.get()
	if (like.exists) {
		console.log(like.data())
		return {success: like.data().timestamp._seconds}
	} else {
		let timestamp = new Date()
		await ref.set({timestamp: timestamp})
		return {success: timestamp.getSeconds()}
	}
})

exports.dislike = functions.https.onCall(async (data, context) => {
	if (!context.auth) {
		throw new Error('Unauthorized')
	}
	if (!data) {
		throw new Error('Pet ID is required')
	}
	if (!data.petId) {
		throw new Error('Pet ID is required')
	}
	let pet = await admin.firestore()
		.collection('pets')
		.doc(data.petId)
		.get()
	if (!pet.exists) {
		throw new Error('Pet does not exist')
	}
	let ref = admin.firestore()
		.collection('pets')
		.doc(data.petId)
		.collection('likes')
		.doc(context.auth.uid)
	let like = await ref.get()
	if (like.exists) {
		await ref.delete()
		return {success: 'Deleted'}
	} else {
		return {error: 'Like does not exist'}
	}
})


