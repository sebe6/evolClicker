var upgrades, shop, rocks, clickCount, language;

function load() {
  loadDefault();
  if(JSON.parse(localStorage.getItem('rocks'))){
    rocks = JSON.parse(localStorage.getItem('rocks'));
    clickCount = JSON.parse(localStorage.getItem('clickCount'));
    localStorage.getItem('language', language);
    
    for (const [key] of Object.entries(shop)) {
      if (localStorage.getItem(`shop_${key}_amount`) !== null) {
        eval(`shop['${key}']['amount'] = JSON.parse(localStorage.getItem('shop_${key}_amount'))`);
      }
    };
    
    for (const [key, value] of Object.entries(upgrades)) {
      for (let i = 0; i <= value['enabled'].length-1; i++) {
        if (localStorage.getItem(`upgrades_${key}_${i}`) !== null) {
          eval(`upgrades['${key}']['enabled'][${i}] = JSON.parse(localStorage.getItem('upgrades_${key}_${i}'))`);
        }
      }
    };

    loadHTMLElement();
    
    //earning from offline
    if (typeof localStorage.getItem('saveDate') !== 'undefined'){ 
      tt = Date.parse(localStorage.getItem('saveDate'));
      var current = new Date().toString();
      current = Date.parse(current);
      diff = (current - tt)/1000;
      offEarn = totalProd()*diff/2;
      
      if(isNaN(offEarn)!==true){
        productionEarning(offEarn);
        if(diff>60){
          alert('You have produced ' + formatNumber(offEarn) + " rocks while you've been offline (50%)");
        }
      }
    }
  }else{
    loadHTMLElement();
  }
}

function save() {
  localStorage.setItem('rocks', rocks)
  localStorage.setItem('clickCount', clickCount)
  var date = new Date().toString();
	localStorage.setItem('saveDate', date);
  localStorage.setItem('language', language);

  for (const [key, value] of Object.entries(shop)) {
    localStorage.setItem(`shop_${key}_amount`, value['amount']);
  };

  for (const [key, value] of Object.entries(upgrades)) {
    for (let i = 0; i <= value['enabled'].length-1; i++) {
      localStorage.setItem(`upgrades_${key}_${i}`, value['enabled'][i]);
    }
  };
}

function reset() {
  localStorage.removeItem('rocks');
  localStorage.removeItem('clickCount');
  localStorage.removeItem('saveDate');
  localStorage.removeItem('language');
  for (const [key] of Object.entries(shop)) {
    localStorage.removeItem(`shop_${key}_amount`);
  };

  for (const [key, value] of Object.entries(upgrades)) {
    for (let i = 1; i <= value['enabled'].length; i++) {
      localStorage.removeItem(`upgrades_${key}_${i}`);
    }
  };

  load();
	//reload();
}

function loadDefault(){
  rocks = 0;
  clickCount = 0;
  language = 'En';
  shopMultiplier = 1;
  shop = {
    'rocksCollector': {
      'nameEn': 'Rock Collector',
      'nameFr': 'Rock Collector',
      'amount': 0,
      'baseCost': 15,
      'costMultiplier': 1.1,
      'production': 0.1,//0.5,
      'image': 'rockCollector2_100x100.png',
    },
    'miners': {
      'nameEn': 'Miners',
      'nameFr': 'Miners',
      'amount': 0,
      'baseCost': 40,
      'costMultiplier': 1.18,
      'production': 0.3,//1,
      'image': 'miners_100x100.png',
    },
    'hunters': {
      'nameEn': 'Hunters',
      'nameFr': 'Hunters',
      'amount': 0,
      'baseCost': 150,
      'costMultiplier': 1.28,
      'production': 1,//3,
      'image': 'hunters_100x100.png',
    },
    'campfire': {
      'nameEn': 'Campfire',
      'nameFr': 'Campfire',
      'amount': 0,
      'baseCost': 800,
      'costMultiplier': 1.40,
      'production': 4,//10,
      'image': 'campfire_100x100.png',
    },
    'stoneCutter': {
      'nameEn': 'Stone Cutter',
      'nameFr': 'Stone Cutter',
      'amount': 0,
      'baseCost': 4e3,
      'costMultiplier': 1.52,
      'production': 15,//40,
      'image': 'stoneCutter_100x100.png',
    },
    'huts': {
      'nameEn': 'Huts',
      'nameFr': 'Huts',
      'amount': 0,
      'baseCost': 28e3,
      'costMultiplier': 1.65,
      'production': 75,//250,
      'image': 'huts_100x100.png',
    },
    'workshop': {
      'nameEn': 'Workshop',
      'nameFr': 'Workshop',
      'amount': 0,
      'baseCost': 160e3,
      'costMultiplier': 1.74,
      'production': 200,//1250,
      'image': 'workshop_100x100.png',
    },
    'cave': {
      'nameEn': 'Cave',
      'nameFr': 'Cave',
      'amount': 0,
      'baseCost': 6e6,
      'costMultiplier': 1.86,
      'production': 800,//5000,
      'image': 'cave_100x100.png',
    },
    'dolmens': {
      'nameEn': 'Dolmens',
      'nameFr': 'Dolmens',
      'amount': 0,
      'baseCost': 100e6,
      'costMultiplier': 1.98,
      'production': 4000,//5000,
      'image': 'dolmens_100x100.png',
    },
  }

  upgrades = {
    'rocksCollector': {
        'nameEn': ['Wooden rock collector','Stone rock collector','Coal rock collector','Copper rock collector','Iron rock collector','Silver rock collector','Golden rock collector','Diamond rock collector'],
        'nameFr': ['Wooden rock collector','Stone rock collector','Coal rock collector','Copper rock collector','Iron rock collector','Silver rock collector','Golden rock collector','Diamond rock collector'],
        'cost': [250,2.5e3,50e3,4e6,4e6,4e6,4e6,4e6],
        'multiplier': [2,2,2,2,2,2,2,2],
        'enabled': [false,false,false,false,false,false,false,false],
        'require': [10,25,50,100,150,200,250,500],
        'image': ['rockCollector_wood_100x100.png','rockCollector_stone_100x100.png','rockCollector_coal_100x100.png','rockCollector_copper_100x100.png','rockCollector_iron2_100x100.png','rockCollector_silver_100x100.png','rockCollector_gold_100x100.png','rockCollector_diamond_100x100.png'],
    },
    'miners': {
        'nameEn': ['Wooden miners','Stone miners','Coal miners','Copper miners','Iron miners','Silver miners','Golden miners','Diamond miners'],
        'nameFr': ['Wooden miners','Stone miners','Coal miners','Copper miners','Iron miners','Silver miners','Golden miners','Diamond miners'],
        'cost': [1e3,12e3,1e6,1.4e9,4e9,4e9,4e9,4e9],
        'multiplier': [2,2,2,2,2,2,2,2],
        'enabled': [false,false,false,false,false,false,false,false],
        'require': [10,25,50,100,150,200,250,500],
        'image': ['miners_wood_100x100.png','miners_stone_100x100.png','miners_coal_100x100.png','miners_copper_100x100.png','miners_iron2_100x100.png','miners_silver_100x100.png','miners_gold_100x100.png','miners_diamond_100x100.png'],
    },
    'hunters': {
        'nameEn': ['Wooden hunters','Stone hunters','Coal hunters','Copper hunters','Iron hunters','Silver hunters','Golden hunters','Diamond hunters'],
        'nameFr': ['Wooden hunters','Stone hunters','Coal hunters','Copper hunters','Iron hunters','Silver hunters','Golden hunters','Diamond hunters'],
        'cost': [5e3,225e3,150e6,35e12,35e12,35e12,35e12,35e12],
        'multiplier': [2,2,2,2,2,2,2,2],
        'enabled': [false,false,false,false,false,false,false,false],
        'require': [10,25,50,100,150,200,250,500],
        'image': ['hunters_wood_100x100.png','hunters_stone_100x100.png','hunters_coal_100x100.png','hunters_copper_100x100.png','hunters_iron2_100x100.png','hunters_silver_100x100.png','hunters_gold_100x100.png','hunters_diamond_100x100.png'],
    },
    'campfire': {
      'nameEn': ['Wooden campfire','Stone campfire','Coal campfire','Copper campfire','Iron campfire','Silver campfire','Golden campfire','Diamond campfire'],
      'nameFr': ['Wooden campfire','Stone campfire','Coal campfire','Copper campfire','Iron campfire','Silver campfire','Golden campfire','Diamond campfire'],
      'cost': [250e3,25e6,12e9,50e15,50e15,50e15,50e15,50e15],
      'multiplier': [2,2,2,2,2,2,2,2],
      'enabled': [false,false,false,false,false,false,false,false],
      'require': [10,25,50,100,150,200,250,500],
      'image': ['campfire_wood_100x100.png','campfire_stone_100x100.png','campfire_coal_100x100.png','campfire_copper_100x100.png','campfire_iron2_100x100.png','campfire_silver_100x100.png','campfire_gold_100x100.png','campfire_diamond_100x100.png'],
    },
    'stoneCutter': {
      'nameEn': ['Wooden stone cutter','Stone stone cutter','Coal stone cutter','Copper stone cutter','Iron stone cutter','Silver stone cutter','Golden stone cutter','Diamond stone cutter'],
      'nameFr': ['Wooden stone cutter','Stone stone cutter','Coal stone cutter','Copper stone cutter','Iron stone cutter','Silver stone cutter','Golden stone cutter','Diamond stone cutter'],
      'cost': [210e3,600e6,140e9,350e15,350e15,350e15,350e15,350e15],
      'multiplier': [2,2,2,2,2,2,2,2],
      'enabled': [false,false,false,false,false,false,false,false],
      'require': [10,25,50,100,150,200,250,500],
      'image': ['stoneCutter_wood_100x100.png','stoneCutter_stone_100x100.png','stoneCutter_coal_100x100.png','stoneCutter_copper_100x100.png','stoneCutter_iron2_100x100.png','stoneCutter_silver_100x100.png','stoneCutter_gold_100x100.png','stoneCutter_diamond_100x100.png'],
    },
    'huts': {
     'nameEn': ['Wooden huts','Stone huts','Coal huts','Copper huts','Iron huts','Silver huts','Golden huts','Diamond huts'],
     'nameFr': ['Wooden huts','Stone huts','Coal huts','Copper huts','Iron huts','Silver huts','Golden huts','Diamond huts'],
     'cost': [20e6,60e9,32e15,40e18,40e18,40e18,40e18,40e18],
     'multiplier': [2,2,2,2,2,2,2,2],
     'enabled': [false,false,false,false,false,false,false,false],
     'require': [10,25,50,100,150,200,250,500],
     'image': ['huts_wood_100x100.png','huts_stone_100x100.png','huts_coal_100x100.png','huts_copper_100x100.png','huts_iron2_100x100.png','huts_silver_100x100.png','huts_gold_100x100.png','huts_diamond_100x100.png'],
    },
    'workshop': {
      'nameEn': ['Wooden workshop','Stone workshop','Coal workshop','Copper workshop','Iron workshop','Silver workshop','Golden workshop','Diamond workshop'],
      'nameFr': ['Wooden workshop','Stone workshop','Coal workshop','Copper workshop','Iron workshop','Silver workshop','Golden workshop','Diamond workshop'],
      'cost': [320e6,700e9,420e15,600e18,600e18,600e18,600e18,600e18],
      'multiplier': [2,2,2,2,2,2,2,2],
      'enabled': [false,false,false,false,false,false,false,false],
      'require': [10,25,50,100,150,200,250,500],
      'image': ['workshop_wood_100x100.png','workshop_stone_100x100.png','workshop_coal_100x100.png','workshop_copper_100x100.png','workshop_iron2_100x100.png','workshop_silver_100x100.png','workshop_gold_100x100.png','workshop_diamond_100x100.png'],
    },
    'cave': {
      'nameEn': ['Wooden cave','Stone cave','Coal cave','Copper cave','Iron cave','Silver cave','Golden cave','Diamond cave'],
      'nameFr': ['Wooden cave','Stone cave','Coal cave','Copper cave','Iron cave','Silver cave','Golden cave','Diamond cave'],
      'cost': [28e6,700e9,420e15,600e18,600e18,600e18,600e18,600e18],
      'multiplier': [2,2,2,2,2,2,2,2],
      'enabled': [false,false,false,false,false,false,false,false],
      'require': [10,25,50,100,150,200,250,500],
      'image': ['cave_wood_100x100.png','cave_stone_100x100.png','cave_coal_100x100.png','cave_copper_100x100.png','cave_iron2_100x100.png','cave_silver_100x100.png','cave_gold_100x100.png','cave_diamond_100x100.png'],
   },
   'dolmens': {
     'nameEn': ['Wooden dolmens','Stone dolmens','Coal dolmens','Copper dolmens','Iron dolmens','Silver dolmens','Golden dolmens','Diamond dolmens'],
     'nameFr': ['Wooden dolmens','Stone dolmens','Coal dolmens','Copper dolmens','Iron dolmens','Silver dolmens','Golden dolmens','Diamond dolmens'],
     'cost': [28e6,700e9,420e15,600e18,600e18,600e18,600e18,600e18],
     'multiplier': [2,2,2,2,2,2,2,2],
     'enabled': [false,false,false,false,false,false,false,false],
     'require': [10,25,50,100,150,200,250,500],
     'image': ['dolmens_wood_100x100.png','dolmens_stone_100x100.png','dolmens_coal_100x100.png','dolmens_copper_100x100.png','dolmens_iron2_100x100.png','dolmens_silver_100x100.png','dolmens_gold_100x100.png','dolmens_diamond_100x100.png'],
  },
}

  specialUpgrades = {
    'mouse': {
      'nameEn': ['Copper mouse','Silver mouse','Golden mouse','Diamond mouse'],
      'nameFr': ['Copper mouse','Silver mouse','Golden mouse','Diamond mouse'],
      'cost': [1e3,100e3,10e6,1e9,100e9],
      'multiplier': [2,2,2,2,2],
      'enabled': [false,false,false,false,false],
      'require': [100, 250, 500, 1000, 2500],
      'image': ['','','','',''],
    },
    'lowest':{
      'nameEn': ['Copper lowest','Silver lowest','Golden lowest','Diamond lowest'],
      'nameFr': ['Copper lowest','Silver lowest','Golden lowest','Diamond lowest'],
      'cost': [30e3,7e6,12e9,50e15],
      'multiplier': [2,2,2,2],
      'enabled': [false,false,false,false],
      'require': [10, 25, 50, 100],
      'image': ['','','',''],
    },
  }
}