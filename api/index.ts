import firebase from 'firebase'
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import {Pet, User} from "../model";
import {isValidURL} from "../utils";

const firebaseConfig = {
	apiKey: "AIzaSyB2lJUJ-qpoHP4hx8nDMZ_iWV1pyIUxbJc",
	authDomain: "pet-finder-65822.firebaseapp.com",
	projectId: "pet-finder-65822",
	storageBucket: "pet-finder-65822.appspot.com",
	messagingSenderId: "663222435357",
	appId: "1:663222435357:web:36126cf385ca69664bd0f4",
	measurementId: "G-997WVR4KND"
};

class API {
	private user: firebase.User | null = null;
	
	constructor() {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
			firebase.functions().useEmulator('192.168.38.217', 5001);
			firebase.firestore().useEmulator('192.168.38.217', 8080)
			firebase.auth().useEmulator('http://192.168.38.217:9099')
		} else {
			firebase.app()
		}
	}
	
	async like(id: string): Promise<boolean> {
		let like: firebase.functions.HttpsCallable | undefined = firebase.functions().httpsCallable('like')
		if (like) {
			try {
				let result = await like({petId: id})
				if (result.data.success) {
					return true;
				} else {
					throw new Error(result.data.error)
				}
			} catch (e) {
				console.error(e.message)
				return false;
			}
		}
		return false;
	}
	
	async dislike(id: string): Promise<boolean> {
		let dislike: firebase.functions.HttpsCallable | undefined = firebase.functions().httpsCallable('dislike')
		if (dislike) {
			try {
				let result = await dislike({petId: id})
				if (result.data.success) {
					return false;
				} else {
					throw new Error(result.data.error)
				}
			} catch (e) {
				console.error(e.message)
			}
		}
		return false;
	}
	
	fetchUser(callback: Function) {
		firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
			this.user = user
			callback(user)
		})
	}
	
	async loginWithEmailAndPassword(email: string, password: string): Promise<string> {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password)
			return ''
		} catch (e) {
			return e.message
		}
	}
	
	async getLike(petId: string, userId: string): Promise<boolean> {
		let like = await firebase.firestore().collection('/pets').doc(petId).collection('likes').doc(userId).get()
		return like.exists
	}
	
	async getPets(): Promise<Pet[]> {
		let result = await firebase.firestore().collection('/pets').get()
		let pets: Array<Pet> = []
		result.forEach((item) => {
			let data = item.data()
			let pet = data as Pet;
			pet.id = item.id
			pets.push(pet)
		})
		console.log(pets)
		return await Promise.all(pets.map(async (pet: Pet) => {
			if (isValidURL(pet.image)) return pet;
			try {
				pet.image = await this.getImageUrl(pet.image + '.jpg')
				pet.liked = await this.getLike(pet.id || '', this.user?.uid || '')
				return pet
			} catch (e: any) {
				// TODO: error handling
				return pet
			}
		}))
	}
	
	async getImageUrl(id: string): Promise<string> {
		return firebase.storage().ref(id).getDownloadURL()
	}
	
	async addPet(pet: Pet): Promise<Pet> {
		
		return {} as Pet
	}
	
	async createUser(name: string, email: string, password: string) {
		let credential = null
		try {
			credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
		} catch (e) {
			return e.message
		}
		let user = credential.user
		if (user === null) {
			return 'Unknown error';
		}
		await firebase.firestore().collection('users').add({
			uid: user.uid,
			displayName: name,
			firstname: name.split(' ')[0] || '',
			lastname: name.split(' ')[1] || ''
		} as User)
		return null
	}
}

const api = new API()

export default api
