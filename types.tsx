import {Pet} from "./model";

export type RootStackParamList = {
	App: undefined;
	NotFound: undefined;
	AddPet: undefined
};

export const defaultChips = [
	{ id: "all", text: "All", selected: true, icon: "paw" } as ChipModel,
	{ id: "dogs", text: "Dogs", selected: false, icon: "dog" } as ChipModel,
	{ id: "cats", text: "Cats", selected: false, icon: "cat" } as ChipModel,
	{ id: "rodents", text: "Rodents", selected: false, icon: "rodent" } as ChipModel,
	{ id: "birds", text: "Birds", selected: false, icon: "food-drumstick" } as ChipModel,
	{ id: "fishes", text: "Fishes", selected: false, icon: "fish" } as ChipModel,
];
export type AuthStackParamList = {
	SignInScreen: undefined;
	SignUpScreen: undefined;
	AuthHomeScreen: undefined;
	ForgotPasswordScreen: undefined;
	NotFound: undefined;
}

export type ScreenProps = {
	navigation: any
	route: any
}
export type PetCardProps = {
	pet: Pet
	open: Function
}
export type PetRatingProps = {
	like: boolean
	setLike: Function
	style?: Object
}
export type ChipSelectionProps = {
	chips: ChipModel[]
	selectChip: Function
	style?: Object
}

export type DropdownPickerProps = {
	selected: string
	label: string
	items: {
		label: string
		value: string
	}[]
	select: Function
}

export interface ChipModel {
	text: string
	selected: boolean
	id: string
	icon: string
}

export type StepProps = {
	onData: Function
	onPrev: Function
	data?: any
}
