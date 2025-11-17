import { Ingredient } from "./ingredient";

export interface Section {
  ingredients: Ingredient[],
  instructions: string[],
  utensils: string[],
}