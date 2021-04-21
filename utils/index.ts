export function isValidURL(string: string): boolean {
	let res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/g);
	return (res !== null)
}

export function capitalize(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}
