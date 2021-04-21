import {Pet} from "./model";

export type RootStackParamList = {
	Root: undefined;
	NotFound: undefined;
};

export type AuthStackParamList = {
	SignInScreen: undefined;
	SignUpScreen: undefined;
	AuthHomeScreen: undefined;
	ForgotPasswordScreen: undefined;
	NotFound: undefined;
}

export type ScreenProps = {
	navigation: any
	route: Object
}
export type PetCardProps = {
	pet: Pet;
}
export type PetRatingProps = {
	like: boolean
	setLike: Function
	style: Object
}
export type ChipSelectionProps = {
	chips: ChipModel[]
	selectChip: Function
	style: Object
}


export interface ChipModel {
	text: string
	selected: boolean
	id: string
	icon: string
}
