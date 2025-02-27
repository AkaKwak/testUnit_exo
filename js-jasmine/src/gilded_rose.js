class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
  }
  
  updateQuality() {
    this.items.forEach(item => {
      if (this.isSulfuras(item)) {
        return; // Sulfuras ne change jamais
      }

      // Mise à jour du sellIn (pour tous les items sauf Sulfuras)
      item.sellIn--;
      
      // Mise à jour de la qualité selon le type d'item
      if (this.isAgedBrie(item)) {
        this.updateAgedBrieQuality(item);
      } else if (this.isBackstagePass(item)) {
        this.updateBackstagePassQuality(item);
      } else if (this.isConjured(item)) {
        this.updateConjuredItemQuality(item);
      } else {
        this.updateNormalItemQuality(item);
      }
      
      // Garantir que la qualité reste dans les limites
      this.ensureQualityWithinLimits(item);
    });
    
    return this.items;
  }
  
  // Méthodes d'identification des types d'items
  isSulfuras(item) {
    return item.name.includes("Sulfuras");
  }
  
  isAgedBrie(item) {
    return item.name === "Aged Brie";
  }
  
  isBackstagePass(item) {
    return item.name.includes("Backstage passes");
  }
  
  isConjured(item) {
    return item.name.includes("Conjured");
  }
  
  isExpired(item) {
    return item.sellIn < 0;
  }
  
  // Méthodes de mise à jour de la qualité selon le type d'item
  updateNormalItemQuality(item) {
    const degradeValue = this.isExpired(item) ? 2 : 1;
    item.quality = Math.max(0, item.quality - degradeValue);
  }
  
  updateAgedBrieQuality(item) {
    const increaseValue = this.isExpired(item) ? 2 : 1;
    item.quality = Math.min(50, item.quality + increaseValue);
  }
  
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
  
  updateConjuredItemQuality(item) {
    const degradeValue = this.isExpired(item) ? 4 : 2;
    item.quality = Math.max(0, item.quality - degradeValue);
  }
  
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