import { Ingredient } from "./ingredient"
import { Section } from "./section"

export interface Recipe {
  id: number,
  name: string,
  content: string,
}

export interface FullRecipe extends Recipe {
  meta: any[],
  ingredients: Ingredient[],
  sections: Section[],
  instructions: string[],
  utensils: string[]
}

