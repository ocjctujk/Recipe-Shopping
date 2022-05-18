import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("f") form: NgForm;
  subscription: Subscription;
  editMode = false;
  indexOfEditing: number;
  editedItem: Ingredient;
  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.indexOfEditing = index;
        this.editedItem = this.slService.getIngredient(index);
        this.form.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  onAddItem() {
    if (!this.editMode) {
      const value = this.form.value;
      const newIngredient = new Ingredient(value.name, value.amount);
      this.slService.addIngredient(newIngredient);
    } else {
      this.slService.updateIngredient(
        this.indexOfEditing,
        this.form.value.amount
      );
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.form.reset();
  }

  onDelete() {
    this.slService.deleteIngredient(this.indexOfEditing);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
