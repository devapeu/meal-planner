import { Ingredient } from "./ingredient";

export interface Section {
  name: string,
  ingredients: Ingredient[],
  instructions: string[],
  utensils: string[],
}