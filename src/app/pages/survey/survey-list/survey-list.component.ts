import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.css']
})
export class SurveyListComponent {

  headeritems = ["Course Name", "Actions"];
  items = [{coursename: 'Navigation', selectopt: false},
  {coursename: "ICAO PANS-OPS Instrument Procedures", selectopt: false},
  {coursename: 'Senior Airport Fire Officers', selectopt: false},
  {coursename: 'Air Traffic Safety Electronics Personnel Communications', selectopt: false},
  {coursename: 'Aviation Mangement', selectopt: false},
  {coursename: 'Airport Fire Safety', selectopt: false},
  {coursename: 'Aviation Safety', selectopt: false}]
  list = true;
  edit = false;
  questionsection = false;
  ratingsection = false;
  questions: Array<Object> = [];
  ratings: Array<Object> = []

  showQuestions() {
    this.questionsection = true;
    this.ratingsection = false;
    this.questions.push({text: ''});
    if (document.getElementById('question')) {
      document.getElementById('question')!.style.background = '#526D82';
      document.getElementById('question')!.style.color = 'white'
      document.getElementById('rating')!.style.background = 'white';
      document.getElementById('rating')!.style.color = '#526D82'
    }
  }

  showRatings() {
    this.questionsection = false;
    this.ratingsection = true;
    this.ratings.push({text: ''});
    if (document.getElementById('rating')) {
      document.getElementById('rating')!.style.background = '#526D82';
      document.getElementById('rating')!.style.color = 'white'
      document.getElementById('question')!.style.background = 'white';
      document.getElementById('question')!.style.color = '#526D82'
    }
  }

  deleteQuestion(i: number) {
    this.questions.splice(i, 1);
  }

  deleteRating(i: number) {
    this.ratings.splice(i, 1);
  }

  selectoption(i: any) {
    i.selectopt = !i.selectopt;
  }

  toggleList() {
    this.list = !this.list;
  }

  toggleEdit() {
    this.edit = !this.edit;
    this.questionsection = false;
    this.ratingsection = false;
    this.list = !this.list;
    console.log("edit click event")
  }

}
