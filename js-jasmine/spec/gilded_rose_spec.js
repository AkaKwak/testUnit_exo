const { Shop, Item } = require('../src/gilded_rose.js');

describe("Gilded Rose", function() {
  // Test complet
  it("full test", () => {
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),
      new Item("Aged Brie", 2, 0),
      new Item("Elixir of the Mongoose", 5, 7),
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 39),
      new Item("Conjured Mana Cake", 3, 6),
    ];

    const days = 2;
    const gildedRose = new Shop(items);

    for (let day = 0; day < days; day++) {
      console.log(`\n-------- day ${day} --------`);
      console.log("name, sellIn, quality");
      items.forEach(item => console.log(`${item.name}, ${item.sellIn}, ${item.quality}`));
      gildedRose.updateQuality();
    }
  });

  // Tests pour chaque règle
  
  // Règle 1: La qualité baisse de 1 pour les items normaux
  it("should decrease quality by 1 for normal items", function() {
    const gildedRose = new Shop([
      new Item("Normal item", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(9);
    expect(items[0].sellIn).toBe(9);
  });
  
  // Règle 2: La qualité baisse deux fois plus vite après la date de péremption
  it("should decrease quality by 2 when sellIn is less than 0", function() {
    const gildedRose = new Shop([
      new Item("Expired item", 0, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
    expect(items[0].sellIn).toBe(-1);
  });
  
  // Règle 3: La qualité n'est jamais négative
  it("should never have negative quality", function() {
    const gildedRose = new Shop([
      new Item("Zero quality item", 5, 0)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
  
  // Règle 4: "Aged Brie" augmente sa qualité avec le temps
  it("should increase quality for Aged Brie", function() {
    const gildedRose = new Shop([
      new Item("Aged Brie", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(11);
  });
  
  // Règle 5: La qualité n'est jamais supérieure à 50
  it("should never increase quality above 50", function() {
    const gildedRose = new Shop([
      new Item("Aged Brie", 10, 50)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50);
  });
  
  // Règle 6: "Sulfuras" ne change jamais de qualité
  it("should not change quality for Sulfuras", function() {
    const gildedRose = new Shop([
      new Item("Sulfuras, Hand of Ragnaros", 10, 80)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80);
    expect(items[0].sellIn).toBe(10); // sellIn ne change pas non plus
  });
  
  // Règle 7: "Backstage passes" augmente sa qualité différemment selon le sellIn
  it("should increase quality by 1 when sellIn > 10 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21);
  });
  
  it("should increase quality by 2 when sellIn <= 10 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22);
  });
  
  // Règle 8: La qualité augmente par 3 quand il reste 5 jours ou moins (Backstage passes)
  it("should increase quality by 3 when sellIn <= 5 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23);
  });
  
  // Règle 9: La qualité tombe à 0 après le concert (Backstage passes)
  it("should set quality to 0 when sellIn < 0 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0);
  });
  
  // Règle 10: Les items "Conjured" perdent deux fois plus de qualité
  it("should decrease quality by 2 for Conjured items", function() {
    const gildedRose = new Shop([
      new Item("Conjured Mana Cake", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8);
  });
  
  it("should decrease quality by 4 for expired Conjured items", function() {
    const gildedRose = new Shop([
      new Item("Conjured Mana Cake", 0, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(6);
  });
}); 
