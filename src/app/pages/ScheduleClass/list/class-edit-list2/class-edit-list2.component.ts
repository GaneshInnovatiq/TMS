import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-edit-list2',
  templateUrl: './class-edit-list2.component.html',
  styleUrls: ['./class-edit-list2.component.css']
})
export class ClassEditList2Component {

  @Output() goBack = new EventEmitter();
  @Output() goNext = new EventEmitter();
  pageone = true;
  

 
  items = ['', '']
  index = 0;
  modalService: any;

  deleteItem(i:number) {
    this.items.splice(i, 1);
    console.log(i);
  }

  addItem() {
    this.items.push('');
  }

  constructor(private router: Router) { }
  
  Back() {
    this.router.navigate(['Schedule Class/List/Edit']);
  }

  Cancel() {
    this.router.navigate(['/Schedule Class/List']);
  }
 
  Submit() {
    this.router.navigate(['/Schedule Class/List']);
  }

}
