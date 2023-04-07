function buyUpgrade(key, index) {
    if (rocks >= upgrades[key]['cost'][index]) {
        rocks -= upgrades[key]['cost'][index];
        upgrades[key]['enabled'][index] = true;
        refreshHTMLElement();
    }
}

function getTotalMultiplier(key) {
	let totalItemMultiplier = 1;
	if(!upgrades[key]) return 1;
    for( let i = 0; i < upgrades[key]['enabled'].length - 1; i++){
      if(upgrades[key]['enabled'][i]) totalItemMultiplier *= upgrades[key]['multiplier'][i];
    }
	return totalItemMultiplier;
}

function getTotalSpecial(key){
	return 1;
}