import { GoogleSignin } from "@react-native-google-signin/google-signin";
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";
import { Pet, User, Request, RequestStatus } from "../model";
import { isValidURL } from "../utils";
const googleMapsApi = "AIzaSyDyVFu4Ipno3Av-PXWGwcm8cD95umaisbQ";
const firebaseConfig = {
	apiKey: "AIzaSyB2lJUJ-qpoHP4hx8nDMZ_iWV1pyIUxbJc",
	authDomain: "pet-finder-65822.firebaseapp.com",
	projectId: "pet-finder-65822",
	storageBucket: "pet-finder-65822.appspot.com",
	messagingSenderId: "663222435357",
	appId: "1:663222435357:web:36126cf385ca69664bd0f4",
	measurementId: "G-997WVR4KND",
};
const server = "192.168.0.132";

class API {
	async changePassword(password: string) {
		await this.user?.updatePassword(password)
	}
	async changeName(name: string) {
		await firebase.firestore().collection('users').doc(this.user?.uid).update({displayName: name, firstname: name.split(' ')[0], lastname: name.split(' ')[1]})
		this.user?.updateProfile({
			displayName: name
		})
	}
	async getSitterCount(id: string): Promise<number> {
		return (await firebase.functions().httpsCallable("getSitterCount")({ id })).data;
	}

	async getMyRequests(): Promise<Request[]> {
		let data = await firebase
			.firestore()
			.collection("requests")
			.where("requester", "==", this.user?.uid)
			.orderBy("status")
			.get();
		let result: Request[] = await Promise.all(
			data.docs.map(async (item) => {
				let request: Request = item.data() as Request;
				request.petEntity = await this.getPet(request.pet);
				request.id = item.id;
				request.requesterEntity = (await this.getUser(request.requester)) || null;
				request.acceptorEntity = (await this.getUser(request.acceptor)) || null;
				return request;
			})
		);
		let accepted = result.filter((i) => i.status === "ACCEPTED");
		accepted.sort((a, b) => +new Date(b.start) - +new Date(a.start));
		return [
			...result.filter((i) => i.status === "REQUESTED"),
			...accepted,
			...result.filter((i) => i.status === "DECLINED"),
		];
	}
	async decline(request: Request) {
		if (request.acceptor !== this.user?.uid) return "Error. You cannot accept";
		if (request.status.toString() !== RequestStatus.REQUESTED.toString()) return "Error. Request is not valid anymore";
		await firebase.firestore().collection("requests").doc(request.id).update({ status: RequestStatus.DECLINED });
		let notification = await firebase
			.firestore()
			.collection("users")
			.doc(this.user?.uid)
			.collection("requests")
			.where("request", "==", request.id)
			.get();

		await notification.forEach(async (doc) => doc.ref.delete());
		return null;
	}
	async accept(request: Request) {
		if (request.acceptor !== this.user?.uid) return "Error. You cannot accept";
		if (request.status.toString() !== RequestStatus.REQUESTED.toString()) return "Error. Request is not valid anymore";
		await firebase.firestore().collection("requests").doc(request.id).update({ status: RequestStatus.ACCEPTED });
		let notification = await firebase
			.firestore()
			.collection("users")
			.doc(this.user?.uid)
			.collection("requests")
			.where("request", "==", request.id)
			.get();

		await notification.forEach(async (doc) => doc.ref.delete());
		return null;
	}
	async getMyPets(): Promise<Pet[]> {
		let result: firebase.firestore.QuerySnapshot;
		result = await firebase.firestore().collection("/pets").where("owner", "==", this.user?.uid).get();
		let pets: Array<Pet> = [];
		result.forEach((item) => {
			let data = item.data();
			let pet = data as Pet;
			pet.id = item.id;
			pets.push(pet);
		});
		return await Promise.all(
			pets.map(async (pet: Pet) => {
				if (isValidURL(pet.image)) return pet;
				try {
					pet.image = await this.getImageUrl(pet.image + ".jpg");
					pet.liked = await this.getLike(pet.id || "", this.user?.uid || "");
					return pet;
				} catch (e: any) {
					// TODO: error handling
					return pet;
				}
			})
		);
	}
	async getRequests() {
		let data = await firebase
			.firestore()
			.collection("requests")
			.where("status", "==", "REQUESTED")
			.where("acceptor", "==", this.user?.uid)
			.get();
		let result: Request[] = await Promise.all(
			data.docs.map(async (item) => {
				let request: Request = item.data() as Request;
				request.petEntity = await this.getPet(request.pet);
				request.id = item.id;
				request.requesterEntity = (await this.getUser(request.requester)) || null;
				request.acceptorEntity = (await this.getUser(request.acceptor)) || null;
				return request;
			})
		);
		return result;
	}
	async searchPets(type: string, search: string) {
		let result: firebase.firestore.QuerySnapshot;
		if (type === "all") {
			result = await firebase
				.firestore()
				.collection("/pets")
				.orderBy("name")
				.startAt(search)
				.endAt(search + "\uf8ff")
				.get();
		} else {
			result = await firebase
				.firestore()
				.collection("/pets")
				.where("type", "==", type)
				.orderBy("name")
				.startAt(search)
				.endAt(search + "\uf8ff")
				.get();
		}
		let pets: Array<Pet> = [];
		result.forEach((item) => {
			let data = item.data();
			let pet = data as Pet;
			pet.id = item.id;
			pets.push(pet);
		});
		return await Promise.all(
			pets.map(async (pet: Pet) => {
				if (isValidURL(pet.image)) return pet;
				try {
					pet.image = await this.getImageUrl(pet.image + ".jpg");
					pet.liked = await this.getLike(pet.id || "", this.user?.uid || "");
					return pet;
				} catch (e: any) {
					// TODO: error handling
					return pet;
				}
			})
		);
	}
	async getPetsCount(uid: string): Promise<number> {
		let result = await firebase.functions().httpsCallable("getPetCount")({ id: uid });
		return result.data;
	}
	async getLikeCount(id: string): Promise<number> {
		let result = await firebase.functions().httpsCallable("getLikeCount")({ id });
		return result.data;
	}

	async request(request: Request) {
		let result = await firebase.functions().httpsCallable("request")(request);
		return result.data;
	}

	public user: firebase.User | null = null;

	constructor() {
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
			firebase.functions().useEmulator(server, 5001);
			firebase.firestore().useEmulator(server, 8080);
			firebase.auth().useEmulator(`http://${server}:9099`);
		} else {
			firebase.app();
		}
	}

	async like(id: string): Promise<boolean> {
		let like: firebase.functions.HttpsCallable | undefined = firebase.functions().httpsCallable("like");
		if (like) {
			try {
				let result = await like({ petId: id });
				if (result.data.success) {
					return true;
				} else {
					throw new Error(result.data.error);
				}
			} catch (e) {
				console.error(e.message);
				return false;
			}
		}
		return false;
	}

	async dislike(id: string): Promise<boolean> {
		let dislike: firebase.functions.HttpsCallable | undefined = firebase.functions().httpsCallable("dislike");
		if (dislike) {
			try {
				let result = await dislike({ petId: id });
				if (result.data.success) {
					return false;
				} else {
					throw new Error(result.data.error);
				}
			} catch (e) {
				console.error(e.message);
			}
		}
		return false;
	}

	async subscribeForRequests(callback: Function) {
		await firebase
			.firestore()
			.collection("users")
			.doc(this.user?.uid)
			.collection("requests")
			.onSnapshot((snapshot) => {
				let res: Request[] = [];
				snapshot.forEach((data) => {
					res.push(data.data() as Request);
				});
				callback(res);
			});
	}

	async getPet(id: string): Promise<Pet | null> {
		let data = await firebase.firestore().collection("pets").doc(id).get();
		let pet = data.data();
		if (pet === undefined) return null;
		if (isValidURL(pet.image)) return pet as Pet;
		try {
			pet.image = await this.getImageUrl(pet.image + ".jpg");
			pet.id = id;
			pet.otherImages = await Promise.all(pet.otherImages.map((i: string) => this.getImageUrl(i + ".jpg")));
			pet.liked = await this.getLike(pet.id || "", this.user?.uid || "");
			return pet as Pet;
		} catch (e: any) {
			// TODO: error handling
			return pet as Pet;
		}
	}

	async getReviewsStat(id: string) {
		let result = await firebase.functions().httpsCallable("getReviewsStat")({ id });
		return result.data;
	}

	fetchUser(callback: Function) {
		firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
			this.user = user;
			callback(user);
		});
	}

	async loginWithEmailAndPassword(email: string, password: string): Promise<string> {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			return "";
		} catch (e) {
			return e.message;
		}
	}

	async getLike(petId: string, userId: string): Promise<boolean> {
		let like = await firebase.firestore().collection("/pets").doc(petId).collection("likes").doc(userId).get();
		return like.exists;
	}

	async getUser(owner: string) {
		let data = await firebase.firestore().collection("users").doc(owner).get();
		return data.data() as User;
	}

	async getPets(type: string = "all"): Promise<Pet[]> {
		let result: firebase.firestore.QuerySnapshot;
		if (type === "all") {
			result = await firebase.firestore().collection("/pets").get();
		} else {
			result = await firebase.firestore().collection("/pets").where("type", "==", type).get();
		}
		let pets: Array<Pet> = [];
		result.forEach((item) => {
			let data = item.data();
			let pet = data as Pet;
			pet.id = item.id;
			pets.push(pet);
		});
		return await Promise.all(
			pets.map(async (pet: Pet) => {
				if (isValidURL(pet.image)) return pet;
				try {
					pet.image = await this.getImageUrl(pet.image + ".jpg");
					pet.liked = await this.getLike(pet.id || "", this.user?.uid || "");
					return pet;
				} catch (e: any) {
					// TODO: error handling
					return pet;
				}
			})
		);
	}

	async getImageUrl(id: string): Promise<string> {
		return firebase.storage().ref(id).getDownloadURL();
	}

	async addPet(pet: Pet): Promise<Pet> {
		// upload main image
		let response = await fetch(pet.image);
		let name = Date.now().toString();
		firebase
			.storage()
			.ref(name + ".jpg")
			.put(await response.blob());
		pet.image = name;

		// upload other images
		for (let i = 0; i < (pet.otherImages || []).length; i++) {
			if (pet.otherImages?.[i] === undefined) {
				continue;
			}
			let name = Date.now().toString();
			let response = await fetch(pet.otherImages?.[i]);
			firebase
				.storage()
				.ref(name + ".jpg")
				.put(await response.blob());
			pet.otherImages[i] = name;
		}
		let result = firebase.functions().httpsCallable("addPet")(pet);
		return (await result).data;
	}

	async createUser(name: string, email: string, password: string) {
		const fb = firebase.initializeApp(firebaseConfig, Date.now().toString());
		fb.auth().useEmulator(`http://${server}:9099`);
		let credential = null;
		try {
			credential = await fb.auth().createUserWithEmailAndPassword(email, password);
		} catch (e) {
			return e.message;
		}

		let user = credential.user;
		if (user === null) {
			return "Unknown error";
		}
		await firebase
			.firestore()
			.collection("users")
			.doc(user.uid)
			.set({
				uid: user.uid,
				displayName: name,
				firstname: name.split(" ")[0] || "",
				lastname: name.split(" ")[1] || "",
			} as User);
		await fb.auth().signOut();
		return null;
	}

	async getLocation(coordinated: any) {
		let res: any = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinated.latitude} ${coordinated.longitude}&key=${googleMapsApi}`
		);
		res = (await res.json()) as any;

		return {
			town: res.results[0].address_components.filter((i: any) => i.types.includes("sublocality"))[0]?.long_name || null,
			country: res.results[0].address_components.filter((i: any) => i.types.includes("country"))[0].long_name,
			all: res.result[0].formatted_address,
		};
	}
}

const api = new API();

export default api;
