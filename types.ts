
export interface DesignConcept {
  title: string;
  description: string;
  suggestions: string[];
}

export interface ShoppingIdea {
  item: string;
  estimatedPrice: string;
}

export interface DesignIdeas {
  currentStyle: string;
  redesignConcept: DesignConcept;
  alternativeConcept: DesignConcept;
  colorPalette: string[];
  shoppingIdeas: ShoppingIdea[];
}
   