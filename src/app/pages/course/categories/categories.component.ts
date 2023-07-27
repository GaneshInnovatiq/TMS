import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoursePaginationModel, MainCategory, SubCategory } from 'src/app/core/models/course.model';
import { CourseService } from 'src/app/core/services/course.service';
import Swal from 'sweetalert2';
import { UtilsService } from 'src/app/core/services/utils.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {

  listCat: any;
  subCategoryForm!: FormGroup;
  mainCategoryForm!: FormGroup;
  mainCategoryId: string = '';
  isSubmitted=false;
  validations=false;
  subCategoryData :SubCategory[]=[];
  coursePaginationModel!: Partial<CoursePaginationModel>;
  totalItems: any;
  pageSizeArr =this.utils.pageSizeArr;
  list :boolean = true;
  dataSource: any;
  constructor(
    private courseService:CourseService,
    private formBuilder: FormBuilder,
    public utils:UtilsService  
  ){
    this.coursePaginationModel = {};
    this.coursePaginationModel.main_category = '0';
    this.coursePaginationModel.sub_category = '0';
  }
  get subcategories(): FormArray {
    return this.subCategoryForm.get('subcategories') as FormArray;
  }
  ngOnInit(): void {
    this.fetchSubCategories();
    this.initMainCategoryForm();
    this.initSubCategoryForm();
    this.addSubCategoryField();
  }
  pageSizeChange($event: any) {
    this.coursePaginationModel.page= $event?.pageIndex + 1;
    this.coursePaginationModel.limit= $event?.pageSize;
    this.fetchSubCategories();
   }

  addSubCategoryField(): void {
    this.subcategories.push(
      this.formBuilder.group({
        category_name: ['', Validators.required]
      })
    );
  }
  initSubCategoryForm(): void {
    this.subCategoryForm = this.formBuilder.group({
      main_category_id: [''],
      subcategories: this.formBuilder.array([])
    });
  }


  createMainCategory(): void {
    this.isSubmitted=true
    if (this.mainCategoryForm.invalid) {
      return;
    }

    const mainCategoryData = this.mainCategoryForm.value;
    this.courseService.createMainCategory(mainCategoryData).subscribe(
      (response) => {
        Swal.fire('Success', 'Main category created successfully!', 'success');
        this.mainCategoryId = response.data._id;
      },
      (error) => {
        Swal.fire('Error', 'Failed to create main category!', 'error');
      }
    );
    this.isSubmitted=false
  }
  createSubCategory(): void {
    this.isSubmitted=true
    if (this.subCategoryForm.invalid) {
      this.validations=true
      return;
    }

    this.subCategoryData = this.subcategories.value;
    this.subCategoryData.forEach(subcategory => {
      subcategory.main_category_id = this.mainCategoryId;
    });

    this.courseService.createSubCategory(this.subCategoryData).subscribe(
      (response) => {
        Swal.fire('Success', 'Subcategories created successfully!', 'success');
        this.mainCategoryForm.reset();
        this.subCategoryForm.reset();
        this.initSubCategoryForm();
        this.addSubCategoryField();
      },
      (error) => {
        Swal.fire('Error', 'Failed to create subcategories!', 'error');
      }
    );
    this.isSubmitted=false
  }

  initMainCategoryForm(): void {
    this.mainCategoryForm = this.formBuilder.group({
      category_name: new FormControl('', [Validators.required,...this.utils.validators.category_name,...this.utils.validators.noLeadingSpace]),
      
    });
  }
  headeritems = ["Main Category", "Sub Category"];
  
  upload() {
    document.getElementById('input')?.click();
  }
  fetchSubCategories(): void {
    this.courseService.getMainCategoriesWithPagination({ ...this.coursePaginationModel}).subscribe(
      (response) => {
        this.listCat = response.data.docs;
        this.totalItems=response.data.totalDocs
        this.coursePaginationModel.docs = response.data.docs;
        this.coursePaginationModel.page = response.data.page;
        this.coursePaginationModel.limit = response.data.limit;
      },
      (error) => {
        console.error('Failed to fetch categories:', error);
      }
    );
  }

  toggleList() {
    this.list = !this.list;
    this.fetchSubCategories();
  }
}
