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
	all: string
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

export enum RequestStatus {
	REQUESTED = 'REQUESTED', DECLINED = 'DECLINED', ACCEPTED = 'ACCEPTED', DONE = 'DONE'
}
export interface Request {
	start: string;
	id?: string;
	duration: number;
	note: string;
	pet: string;
	requester: string;
	acceptor: string;
	status: RequestStatus,
	petEntity?: Pet | null,
	requesterEntity?: User | null
	acceptorEntity?: User | null
}

export interface Review {
	text: string;
	rating: number;
	created: Date;
	author: string;
}
