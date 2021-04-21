export interface User {
	displayName: string
	uid: string
}

export interface Location {
	town: string
	country: string
	lt: number
	lg: number
	radius: number
}

export interface Pet {
	id: string
	name: string
	type: string
	owner: string
	image: string
	location: Location
}
