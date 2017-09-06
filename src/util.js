function sortBy(key) {
	return function (a, b) {
		return (a[key] > b[key]) ? 1 : -1;
	}
}

function groupBy({ collection, groupKey, sortKey }) {
	let out = {};

	const putInBucket = obj => {
		let bucket = obj[groupKey];
		out[bucket] = out[bucket] || [];
		out[bucket].push(obj);
	};

	if ( collection instanceof Array ) {
		collection.forEach(putInBucket);
	} else {
		Object.keys(collection).forEach(collectionKey => putInBucket(collection[collectionKey]));
	}

	if ( sortKey ) {
		const sorter = sortBy(sortKey);

		Object.keys(out).forEach(outKey => out[outKey].sort(sorter));
	}

	return out;
}

function pluralize(s) {
	if ( s.match(/battery$/) ) {
		return s.replace(/y$/, "ies");
	}

	return s + "s";
}

const nameSort = sortBy("name");

const sizeToInt = {
	Tiny: 1,
	Small: 2,
	Medium: 3,
	Large: 4,
	Huge: 5,
	Gargantuan: 6,
	Colossal: 7,
};

const weaponClassToInt = {
	Light: 1,
	Heavy: 3,
	Capital: 5,
};

const rangeToInt = {
	Short: 5,
	Medium: 10,
	Long: 20,
};

export {
	groupBy,
	nameSort,
	pluralize,
	rangeToInt,
	sizeToInt,
	sortBy,
	weaponClassToInt,
}
