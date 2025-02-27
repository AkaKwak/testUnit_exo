/**
 * Classe Item - Représente un article dans l'inventaire
 * Note: Selon les règles, cette classe ne doit pas être modifiée
 * (sauf pour ajouter des propriétés statiques ou des méthodes)
 */
class Item {
  constructor(name, sellIn, quality) {
    this.name = name;      // Nom de l'article
    this.sellIn = sellIn;  // Nombre de jours restants pour vendre l'article
    this.quality = quality; // Valeur représentant la qualité de l'article
  }
}

/**
 * Classe Shop - Gère l'inventaire des articles et leur mise à jour quotidienne
 * C'est cette classe qui a été refactorisée pour améliorer la lisibilité et la maintenabilité
 */
class Shop {
  constructor(items = []) {
    this.items = items; // Liste des articles en stock
  }
  
  /**
   * Méthode principale qui met à jour la qualité et le sellIn de tous les articles
   * @returns {Array} - La liste des articles mise à jour
   */
  updateQuality() {
    this.items.forEach(item => {
      // Règle 7: Sulfuras est un objet légendaire et ne change jamais
      if (this.isSulfuras(item)) {
        return; // Sulfuras ne change jamais
      }

      // Mise à jour du sellIn (pour tous les items sauf Sulfuras)
      // Règle 1: Le sellIn baisse de 1 pour tous les articles normaux
      item.sellIn--;
      
      // Mise à jour de la qualité selon le type d'item
      if (this.isAgedBrie(item)) {
        // Règle 2: La qualité d'Aged Brie augmente avec le temps
        this.updateAgedBrieQuality(item);
      } else if (this.isBackstagePass(item)) {
        // Règles 2, 3, 4 et 6: Backstage passes ont des règles spéciales
        this.updateBackstagePassQuality(item);
      } else if (this.isConjured(item)) {
        // Règle 9: Les éléments "Conjured" se dégradent deux fois plus vite
        this.updateConjuredItemQuality(item);
      } else {
        // Règles 1 et 5: Items normaux
        this.updateNormalItemQuality(item);
      }
      
      // Règle 8: La qualité ne peut jamais dépasser 50
      // Règle 5: La qualité ne peut jamais être négative
      this.ensureQualityWithinLimits(item);
    });
    
    return this.items;
  }
  
  // Méthodes d'identification des types d'items
  /**
   * Vérifie si l'item est "Sulfuras"
   * @param {Item} item - L'article à vérifier
   * @returns {boolean} - True si c'est Sulfuras, false sinon
   */
  isSulfuras(item) {
    return item.name.includes("Sulfuras");
  }
  
  /**
   * Vérifie si l'item est "Aged Brie"
   * @param {Item} item - L'article à vérifier
   * @returns {boolean} - True si c'est Aged Brie, false sinon
   */
  isAgedBrie(item) {
    return item.name === "Aged Brie";
  }
  
  /**
   * Vérifie si l'item est un "Backstage pass"
   * @param {Item} item - L'article à vérifier
   * @returns {boolean} - True si c'est un backstage pass, false sinon
   */
  isBackstagePass(item) {
    return item.name.includes("Backstage passes");
  }
  
  /**
   * Vérifie si l'item est un article "Conjured"
   * @param {Item} item - L'article à vérifier
   * @returns {boolean} - True si c'est un article conjured, false sinon
   */
  isConjured(item) {
    return item.name.includes("Conjured");
  }
  
  /**
   * Vérifie si l'item est périmé (sellIn < 0)
   * @param {Item} item - L'article à vérifier
   * @returns {boolean} - True si l'article est périmé, false sinon
   */
  isExpired(item) {
    return item.sellIn < 0;
  }
  
  // Méthodes de mise à jour de la qualité selon le type d'item
  /**
   * Met à jour la qualité d'un article normal
   * Règle 1: La qualité diminue de 1 chaque jour
   * Règle 5: La qualité diminue deux fois plus vite après la date de péremption
   * @param {Item} item - L'article à mettre à jour
   */
  updateNormalItemQuality(item) {
    const degradeValue = this.isExpired(item) ? 2 : 1;
    item.quality = Math.max(0, item.quality - degradeValue);
  }
  
  /**
   * Met à jour la qualité de "Aged Brie"
   * Règle 2: La qualité d'Aged Brie augmente avec le temps
   * La qualité augmente deux fois plus vite après la date de péremption
   * @param {Item} item - L'article à mettre à jour
   */
  updateAgedBrieQuality(item) {
    const increaseValue = this.isExpired(item) ? 2 : 1;
    item.quality = Math.min(50, item.quality + increaseValue);
  }
  
  /**
   * Met à jour la qualité de "Backstage passes"
   * Règle 2: La qualité augmente de 1 quand sellIn > 10
   * Règle 3: La qualité augmente de 2 quand sellIn <= 10
   * Règle 4: La qualité augmente de 3 quand sellIn <= 5
   * Règle 6: La qualité tombe à 0 après le concert (sellIn < 0)
   * @param {Item} item - L'article à mettre à jour
   */
  updateBackstagePassQuality(item) {
    if (this.isExpired(item)) {
      item.quality = 0;
      return;
    }
    
    if (item.sellIn < 5) {
      item.quality += 3;
    } else if (item.sellIn < 10) {
      item.quality += 2;
    } else {
      item.quality += 1;
    }
  }
  
  /**
   * Met à jour la qualité des articles "Conjured"
   * Règle 9: Les éléments "Conjured" se dégradent deux fois plus vite
   * (baissent de 2 quand sellIn > 0, baissent de 4 quand sellIn <= 0)
   * @param {Item} item - L'article à mettre à jour
   */
  updateConjuredItemQuality(item) {
    const degradeValue = this.isExpired(item) ? 4 : 2;
    item.quality = Math.max(0, item.quality - degradeValue);
  }
  
  /**
   * S'assure que la qualité reste dans les limites autorisées
   * Règle 8: La qualité n'est jamais supérieure à 50
   * Règle 5: La qualité n'est jamais négative
   * Règle 7: Sulfuras est une exception et peut avoir une qualité > 50
   * @param {Item} item - L'article à vérifier
   */
  ensureQualityWithinLimits(item) {
    if (!this.isSulfuras(item)) {
      item.quality = Math.min(50, Math.max(0, item.quality));
    }
  }
}

module.exports = {
  Item,
  Shop
}; 