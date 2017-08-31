function sortBy(key) {
	return function (a, b) {
		return (a.key > b.key) ? 1 : -1;
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

	const sorter = sortBy(sortKey);
	console.log(sorter.toString());

	Object.keys(out).forEach(outKey => out[outKey].sort(sorter));

	return out;
}

const nameSort = sortBy("name");

export {
	groupBy,
	nameSort,
	sortBy,
}
