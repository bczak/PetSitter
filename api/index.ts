import {app, apps, firestore, initializeApp, storage} from 'firebase';

import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import {Pet} from "../model";
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
	constructor() {
		if (!apps.length) {
			initializeApp(firebaseConfig);
		} else {
			app()
		}
	}

	async getPets(): Promise<Pet[]> {
		let result = await firestore().collection('/pets').get()
		let pets: Array<Pet> = []
		result.forEach((item) => {
			let data = item.data()
			let pet = data as Pet;
			pet.id = item.id
			pets.push(pet)
		})
		return await Promise.all(pets.map(async (pet: Pet) => {
			if (isValidURL(pet.image)) return pet;
			try {
				pet.image = await firebase.getImageUrl(pet.image + '.jpg')
				return pet
			} catch (e: any) {
				return pet
			}
		}))
	}

	async getImageUrl(id: string): Promise<string> {
		return storage().ref(id).getDownloadURL()
	}
}

const firebase = new API()

export default firebase
