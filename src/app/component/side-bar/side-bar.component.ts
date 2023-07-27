import { Component } from '@angular/core';
import { Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {

  @Output() newItemEvent = new EventEmitter<boolean>();
  // collapsed :boolean = false;
  // openSidebar: boolean = true;
  // status: boolean = false;


  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   console.log(event.target.innerWidth)
  //   const needCollapse = event.target.innerWidth < 992
  //   if(needCollapse!==this.collapsed) {
  //     this.collapsed = needCollapse;
  //     this.newItemEvent.emit(needCollapse);
  //   }
    
  // }

  menuSidebar = [
    {
      link_name: "Dashboard",
      link: "/Dashboard",
      icon: "bx bx-grid-alt",
      sub_menu: []
    },  
    {
      link_name: "Course",
      link: "/course",
      icon: "bx bxs-book-open",
      sub_menu: [
        {
          link_name: "List",
          link: "/list",
        },
        {
          link_name: "Add",
          link: "/add",
        }, {
          link_name: "Course Apprval",
          link: "/course-approval",
        }, {
          link_name: "Course Kit",
          link: "/course-kit",
        },
        {
          link_name: "Categories",
          link: "/categories",
        }
      ]
    }, 
    {
      link_name: "Schedule Class",
      link: "/schedule",
      icon: "bx bxs-calendar-event",
      sub_menu: [
        {
          link_name: "List",
          link: "/class-list",
        },
        {
          link_name: "Add",
          link: "/class-add",
        }, {
          link_name: "Approval List",
          link: "/approval-list",
        }, {
          link_name: "Completion List",
          link: "/completion-list",
        }
      ]
    }, 
    {
      link_name: "Fellowship",
      link: "/felliate",
      icon: "bx bxs-group",
      sub_menu: []
    }, 
    {
      link_name: "Survey",
      link: "/survey",
      icon: "bx bxs-notepad",
      sub_menu: [
        {
        link_name: "List",
        link: "/survey-list",
       },
    ]
    }, 
    {
      link_name: "Aduit",
      link: "/aduit",
      icon: "bx bxs-file-find",
      sub_menu: []
    }, 
    {
      link_name: "Home Content",
      link: "/dashboard",
      icon: "bx bxs-home",
      sub_menu: []
    }, 
    {
      link_name: "User List",
      link: "/dashboard",
      icon: "bx bxs-user-detail",
      sub_menu: []
    }, 
    {
      link_name: "Survey Builder",
      link: "/dashboard",
      icon: "bx bxs-bar-chart-alt-2",
      sub_menu: [
        
      ]
    }, 
    {
      link_name: "Certificate Builder",
      link: "/dashboard",
      icon: "bx bxs-certification",
      sub_menu: []
    }, 
    {
      link_name: "Email Config",
      link: "/dashboard",
      icon: "bx bxs-envelope",
      sub_menu: []
    }, 
    
  ]

  constructor() { }

  ngOnInit() {

  }

  showSubmenu(itemEl: HTMLElement) {
    itemEl.classList.toggle("showMenu");
    console.log("clicked....")
  }

}
