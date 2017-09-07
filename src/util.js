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

function mountIntsToText(mounts) {
	if ( !(mounts instanceof Array) || !mounts.length ) {
		return "none";
	}

	// light = 1, heavy = 2, capital = 3
	let classCounts = [null, 0, 0, 0];
	let classTexts = [];
	mounts.forEach(mount => classCounts[mount]++);

	[
		{ val: 3, text: "capital" },
		{ val: 2, text: "heavy" },
		{ val: 1, text: "light" },
	].forEach(def => {
		if ( classCounts[def.val] ) {
			classTexts.push(classCounts[def.val] + " " + def.text);
		}
	});

	return classTexts.join(", ");
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

// The JSON mounts use 1, 2, and 3 for mount classes. I should clean that up so they also use the
// 1/3/5 stuff
const weaponClassToMountInt = {
	Light: 1,
	Heavy: 2,
	Capital: 3,
};

const rangeToInt = {
	Short: 5,
	Medium: 10,
	Long: 20,
};

const expansionBayCalculations = {
	maxSlots: function () {
		return this.$store.state.currentShip.frame.expansionBays;
	},
	remainingSlots: function () {
		return this.maxSlots - this.usedSlots;
	},
	selectedExpansionBays: function () {
		return this.$store.state.currentShip.expansionBays;
	},
	usedSlots: function () {
		return this.selectedExpansionBays.reduce((sum, bay) => { return sum + bay.bays; }, 0);
	},
};

export {
	expansionBayCalculations,
	groupBy,
	mountIntsToText,
	nameSort,
	pluralize,
	rangeToInt,
	sizeToInt,
	sortBy,
	weaponClassToInt,
	weaponClassToMountInt,
}
