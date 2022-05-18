import { EventEmitter, Injectable } from "@angular/core";

import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();
  recipeChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      "Tasty Schnitzel",
      "A super-tasty Schnitzel - just awesome!",
      "https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG",
      [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]
    ),
    new Recipe(
      "Big Fat Burger",
      "What else you need to say?",
      "https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg",
      [new Ingredient("Buns", 2), new Ingredient("Meat", 1)]
    ),
  ];

  constructor(
    private slService: ShoppingListService,
    private http: HttpClient
  ) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(newRecipe: Recipe) {
    this.recipes.push(newRecipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    console.log("delete");
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

  storeRecipes() {
    this.http
      .put(
        "https://recipe-book-a83b8-default-rtdb.firebaseio.com/recipes.json",
        this.recipes
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    console.log("called");
    this.http
      .get("https://recipe-book-a83b8-default-rtdb.firebaseio.com/recipes.json")
      .subscribe((recipesFetched: Recipe[]) => {
          console.log(recipesFetched);
          this.recipes = recipesFetched;
          this.recipeChanged.next(this.recipes.slice());
      });
  }
}
