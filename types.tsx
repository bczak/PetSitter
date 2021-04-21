import {Pet} from "./model";

export type RootStackParamList = {
	Root: undefined;
	NotFound: undefined;
};

export type AuthStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
	NotFound: undefined
}

export type BottomTabParamList = {
	Home: undefined;
	Search: undefined;
	Chat: undefined;
	Activity: undefined;
	Profile: undefined;
};

export type HomeParamList = {
	HomeScreen: undefined;
	FavoriteScreen: undefined;
};
export type ScreenParamList = {
	SearchScreen: undefined;
};
export type ChatParamList = {
	ChatScreen: undefined;
};
export type ActivityParamList = {
	ActivityScreen: undefined;
};
export type ProfileParamList = {
	ProfileScreen: undefined;
};

export type ScreenProps = {
	navigation: Object
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
