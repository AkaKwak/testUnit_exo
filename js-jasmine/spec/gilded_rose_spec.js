/**
 * Tests pour la classe Gilded Rose
 * Ces tests vérifient que toutes les règles d'affaires sont correctement implémentées
 */
const { Shop, Item } = require('../src/gilded_rose.js');

describe("Gilded Rose", function() {
  /**
   * Test complet qui vérifie le comportement global du système
   * Ce test simule l'exécution du programme sur plusieurs jours
   * et affiche les résultats dans la console
   */
  it("full test", () => {
    // Création de plusieurs types d'articles pour tester tous les cas
    const items = [
      new Item("+5 Dexterity Vest", 10, 20),                           // Item normal
      new Item("Aged Brie", 2, 0),                                     // Aged Brie avec qualité initiale 0
      new Item("Elixir of the Mongoose", 5, 7),                        // Item normal
      new Item("Sulfuras, Hand of Ragnaros", 0, 80),                   // Sulfuras - ne change jamais
      new Item("Sulfuras, Hand of Ragnaros", -1, 80),                  // Sulfuras expiré - ne change jamais
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),   // Backstage pass > 10 jours
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 49),   // Backstage pass = 10 jours et proche de la qualité max
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 39),    // Backstage pass <= 5 jours
      new Item("Conjured Mana Cake", 3, 6),                            // Item "Conjured"
    ];

    // Simulation sur 2 jours
    const days = 2;
    const gildedRose = new Shop(items);

    // Pour chaque jour, affiche l'état des articles et met à jour leur qualité
    for (let day = 0; day < days; day++) {
      console.log(`\n-------- day ${day} --------`);
      console.log("name, sellIn, quality");
      items.forEach(item => console.log(`${item.name}, ${item.sellIn}, ${item.quality}`));
      gildedRose.updateQuality();
    }
  });

  /**
   * Tests individuels pour chaque règle d'affaires
   * Chaque test vérifie une règle spécifique du système
   */
  
  /**
   * Règle 1: La qualité et le sellIn des items normaux baissent de 1
   * Vérifie que la qualité et le sellIn diminuent de 1 pour un article normal
   */
  it("should decrease quality by 1 for normal items", function() {
    const gildedRose = new Shop([
      new Item("Normal item", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(9); // La qualité diminue de 1
    expect(items[0].sellIn).toBe(9);  // Le sellIn diminue de 1
  });
  
  /**
   * Règle 5: Quand un produit est périmé, la qualité baisse 2 fois plus vite
   * Vérifie que la qualité diminue de 2 pour un article normal périmé
   */
  it("should decrease quality by 2 when sellIn is less than 0", function() {
    const gildedRose = new Shop([
      new Item("Expired item", 0, 10) // Le sellIn devient -1 après updateQuality
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8); // La qualité diminue de 2 car l'article est périmé
    expect(items[0].sellIn).toBe(-1); // Le sellIn est maintenant négatif (périmé)
  });
  
  /**
   * La qualité ne peut jamais être négative
   * Vérifie que la qualité reste à 0 même si elle devrait diminuer
   */
  it("should never have negative quality", function() {
    const gildedRose = new Shop([
      new Item("Zero quality item", 5, 0) // La qualité est déjà à 0
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0); // La qualité reste à 0, pas de valeur négative
  });
  
  /**
   * Règle 2: La qualité augmente de 1 pour "Aged Brie"
   * Vérifie que la qualité d'Aged Brie augmente avec le temps
   */
  it("should increase quality for Aged Brie", function() {
    const gildedRose = new Shop([
      new Item("Aged Brie", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(11); // La qualité d'Aged Brie augmente de 1
  });
  
  /**
   * Règle 8: La qualité n'augmente pas au-dessus de 50
   * Vérifie que la qualité reste à 50 même si elle devrait augmenter
   */
  it("should never increase quality above 50", function() {
    const gildedRose = new Shop([
      new Item("Aged Brie", 10, 50) // La qualité est déjà à 50
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(50); // La qualité reste à 50, pas au-dessus
  });
  
  /**
   * Règle 7: La qualité de Sulfuras n'est pas modifiée
   * Vérifie que Sulfuras ne change ni en qualité ni en sellIn
   */
  it("should not change quality for Sulfuras", function() {
    const gildedRose = new Shop([
      new Item("Sulfuras, Hand of Ragnaros", 10, 80)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(80); // La qualité de Sulfuras reste inchangée
    expect(items[0].sellIn).toBe(10); // Le sellIn de Sulfuras reste inchangé
  });
  
  /**
   * Règle 2: La qualité des "Backstage passes" augmente de 1 quand sellIn > 10
   * Vérifie l'augmentation normale de qualité pour les backstage passes
   */
  it("should increase quality by 1 when sellIn > 10 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(21); // La qualité augmente de 1 quand sellIn > 10
  });
  
  /**
   * Règle 3: La qualité augmente de 2 quand il reste 10 jours ou moins
   * Vérifie l'augmentation accélérée de qualité quand sellIn <= 10
   */
  it("should increase quality by 2 when sellIn <= 10 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(22); // La qualité augmente de 2 quand sellIn <= 10
  });
  
  /**
   * Règle 4: La qualité augmente de 3 quand il reste 5 jours ou moins
   * Vérifie l'augmentation très accélérée de qualité quand sellIn <= 5
   */
  it("should increase quality by 3 when sellIn <= 5 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(23); // La qualité augmente de 3 quand sellIn <= 5
  });
  
  /**
   * Règle 6: La qualité tombe à 0 après le concert (Backstage passes)
   * Vérifie que la qualité des backstage passes est mise à 0 après l'événement
   */
  it("should set quality to 0 when sellIn < 0 for Backstage passes", function() {
    const gildedRose = new Shop([
      new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20) // Devient périmé après updateQuality
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(0); // La qualité tombe à 0 après le concert
  });
  
  /**
   * Règle 9: Les éléments "Conjured" baissent 2 fois plus rapidement
   * Vérifie que la qualité des items conjured diminue de 2 au lieu de 1
   */
  it("should decrease quality by 2 for Conjured items", function() {
    const gildedRose = new Shop([
      new Item("Conjured Mana Cake", 10, 10)
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(8); // La qualité diminue de 2 pour les items conjured
  });
  
  /**
   * Règle 9: Les éléments "Conjured" périmés baissent 4 fois plus rapidement
   * Vérifie que les items conjured périmés perdent 4 points de qualité
   */
  it("should decrease quality by 4 for expired Conjured items", function() {
    const gildedRose = new Shop([
      new Item("Conjured Mana Cake", 0, 10) // Devient périmé après updateQuality
    ]);
    const items = gildedRose.updateQuality();
    expect(items[0].quality).toBe(6); // La qualité diminue de 4 pour les items conjured périmés
  });
}); 
