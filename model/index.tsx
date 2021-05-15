export interface User {
	displayName: string;
	uid: string;
	firstname?: string;
	lastname?: string;
}

export interface Location {
	town: string;
	country: string;
	lt?: number;
	lg?: number;
	radius?: number;
}

export interface Pet {
	id?: string;
	name: string;
	type: string;
	owner?: string;
	image: string;
	location: Location;
	liked?: boolean;
	otherImages?: string[];
	birthday?: string;
	breed?: string;
}

export enum BookType {
	WALK,
	CARE,
}

export interface Book {
	type: BookType;
	start: Date;
	date: Date;
	pet: string;
	requestor: string;
}

export interface Review {
	text: string;
	rating: number;
	created: Date;
	author: string;
}
