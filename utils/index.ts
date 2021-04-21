export function isValidURL(string: string): boolean {
	let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g);
	return (res !== null)
}


export const emailValidator = (email: string) => {
	const re = /\S+@\S+\.\S+/;

	if (!email || email.length <= 0) return 'Email cannot be empty.';
	if (!re.test(email)) return 'Ooops! We need a valid email address.';

	return '';
};

export const passwordValidator = (password: string) => {
	if (!password || password.length <= 0) return 'Password cannot be empty.';

	return '';
};

export const nameValidator = (name: string) => {
	if (!name || name.length <= 0) return 'Name cannot be empty.';

	return '';
};
